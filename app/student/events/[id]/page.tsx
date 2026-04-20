import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EventDetailsClient from './EventDetailsClient'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: { faculty: true }
  })
  
  if (!event) return notFound()

  // Find dummy student for registration
  const student = await prisma.user.findFirst({
    where: { role: 'STUDENT' },
    include: { registrations: true }
  })

  // How many registered so far?
  const registrationCount = await prisma.registration.count({ where: { eventId: event.id } })

  const isRegistered = student?.registrations.some(r => r.eventId === event.id) || false

  return (
    <EventDetailsClient 
      event={{...event, facultyName: event.faculty.name}} 
      studentId={student?.id} 
      isInitiallyRegistered={isRegistered} 
      registrationCount={registrationCount} 
    />
  )
}
