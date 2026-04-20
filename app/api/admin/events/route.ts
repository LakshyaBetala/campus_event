import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/admin/events — returns pending events + analytics
export async function GET() {
  try {
    const [pendingEvents, totalUsers, totalEvents, totalRegistrations] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'PENDING' },
        include: { faculty: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count(),
    ])

    return NextResponse.json({
      pendingEvents,
      analytics: { totalUsers, totalEvents, totalRegistrations }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

// PATCH /api/admin/events — approve or reject an event
export async function PATCH(req: Request) {
  try {
    const { eventId, action } = await req.json()

    if (!eventId || !['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json({ error: 'Invalid eventId or action.' }, { status: 400 })
    }

    if (action === 'REJECTED') {
      await prisma.event.delete({ where: { id: eventId } })
      return NextResponse.json({ success: true, message: 'Event rejected and removed.' })
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'APPROVED' }
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
