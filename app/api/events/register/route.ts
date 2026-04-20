import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { studentId, eventId } = await req.json()

    // Validate capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    })

    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (event._count.registrations >= event.maxParticipants) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 })
    }

    const reg = await prisma.registration.create({
      data: {
        studentId,
        eventId
      }
    })

    return NextResponse.json({ success: true, registration: reg })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
