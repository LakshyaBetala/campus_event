import prisma from '@/lib/prisma'
import DashboardClient from './DashboardClient'

export const dynamic = "force-dynamic"

export default async function StudentPage() {
  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
    include: { faculty: true },
    orderBy: { date: 'asc' }
  })
  
  const student = await prisma.user.findFirst({
    where: { role: 'STUDENT' },
    include: { registrations: true }
  })
  
  // Transform data slightly to pass to client
  const serializedEvents = events.map(e => ({
    ...e,
    facultyName: e.faculty.name
  }))

  return <DashboardClient initialEvents={serializedEvents} studentId={student?.id || ''} registeredIds={student?.registrations.map(r => r.eventId) || []} />
}
