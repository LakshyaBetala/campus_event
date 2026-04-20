import prisma from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = "force-dynamic"

export default async function AdminPage() {
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

  return (
    <AdminDashboardClient
      initialPendingEvents={pendingEvents.map(e => ({ ...e, facultyName: e.faculty.name }))}
      analytics={{ totalUsers, totalEvents, totalRegistrations }}
    />
  )
}
