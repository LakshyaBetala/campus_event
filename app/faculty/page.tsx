import prisma from '@/lib/prisma'
import FacultyDashboardClient from './FacultyDashboardClient'

export const dynamic = "force-dynamic"

export default async function FacultyPage() {
  const faculty = await prisma.user.findFirst({
    where: { role: 'FACULTY' },
  })

  const events = await prisma.event.findMany({
    where: { facultyId: faculty?.id },
    include: {
      registrations: { include: { student: true } },
    },
    orderBy: { createdAt: 'desc' }
  })

  return <FacultyDashboardClient events={events} facultyName={faculty?.name} />
}
