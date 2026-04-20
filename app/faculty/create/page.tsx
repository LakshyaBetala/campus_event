import prisma from '@/lib/prisma'
import CreateEventClient from './CreateEventClient'

export const dynamic = "force-dynamic"

export default async function CreateEventPage() {
  const faculty = await prisma.user.findFirst({
    where: { role: 'FACULTY' },
  })

  return <CreateEventClient facultyId={faculty?.id || ""} />
}
