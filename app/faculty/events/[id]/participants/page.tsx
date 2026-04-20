import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ParticipantListClient from './ParticipantListClient'

export const dynamic = "force-dynamic"

export default async function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { student: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!event) return notFound()

  const participants = event.registrations.map((r, index) => ({
    sNo: index + 1,
    name: r.student.name,
    studentId: r.student.id,
    email: r.student.email,
    registeredAt: r.createdAt.toISOString(),
  }))

  return <ParticipantListClient event={{ id: event.id, title: event.title, date: event.date, venue: event.venue, maxParticipants: event.maxParticipants }} participants={participants} />
}
