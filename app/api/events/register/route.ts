import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { studentId, eventId } = await req.json()

    if (!studentId || !eventId) {
      return NextResponse.json({ error: 'studentId and eventId are required.' }, { status: 400 })
    }

    // Validate capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    })

    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })

    if (event.status !== 'APPROVED') {
      return NextResponse.json({ error: 'This event is not available for registration.' }, { status: 403 })
    }

    if (event._count.registrations >= event.maxParticipants) {
      return NextResponse.json({ error: 'This event is full. No spots remaining.' }, { status: 409 })
    }

    const reg = await prisma.registration.create({
      data: { studentId, eventId }
    })

    // Fire-and-forget async notification (US: Notifications)
    // In a real system this would push to a queue (BullMQ / Inngest / etc.)
    // We simulate it with a detached async task so it never blocks the response.
    setImmediate(async () => {
      try {
        const student = await prisma.user.findUnique({ where: { id: studentId } })
        // Simulate sending an email/notification
        console.log(`[NOTIFICATION] Registration confirmed for "${student?.name}" → Event: "${event.title}" on ${event.date} at ${event.venue}`)
        // In production: await sendEmail({ to: student.email, subject: `Registered for ${event.title}`, ... })
      } catch (notifError) {
        console.error('[NOTIFICATION] Failed to send notification:', notifError)
      }
    })

    return NextResponse.json({ success: true, registration: reg })
  } catch (error) {
    // Catch Prisma unique constraint violation (duplicate registration)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
