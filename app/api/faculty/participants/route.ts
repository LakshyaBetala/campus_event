import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/faculty/participants?eventId=xxx&format=csv|json
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const format = searchParams.get('format') || 'json'

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required.' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: { student: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    const participants = event.registrations.map((r, index) => ({
      sNo: index + 1,
      name: r.student.name,
      id: r.student.id,
      email: r.student.email,
      registeredAt: r.createdAt,
    }))

    if (format === 'csv') {
      const header = 'S.No,Student Name,Student ID,Email,Registered At\n'
      const rows = participants
        .map(p => `${p.sNo},"${p.name}","${p.id}","${p.email}","${new Date(p.registeredAt).toISOString()}"`)
        .join('\n')
      const csvContent = header + rows

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="participants_${event.title.replace(/\s+/g, '_')}.csv"`,
        }
      })
    }

    return NextResponse.json({ event: { id: event.id, title: event.title }, participants })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
