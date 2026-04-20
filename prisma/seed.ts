import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo database...')

  // Clean existing data
  await prisma.registration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash: 'password123',
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create Faculty
  const faculty = await prisma.user.create({
    data: {
      email: 'faculty@demo.com',
      passwordHash: 'password123',
      name: 'Dr. Sarah Demo',
      role: 'FACULTY'
    }
  })

  // Create Student
  const student = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      passwordHash: 'password123',
      name: 'Alex Student',
      role: 'STUDENT'
    }
  })

  // Create APPROVED events
  const event1 = await prisma.event.create({
    data: {
      title: 'Introduction to Web Development Workshop',
      description: 'Learn the basics of HTML, CSS, and interactive JavaScript in this hands-on workshop. Bring a laptop and leave with a working project.',
      date: '2026-05-15',
      time: '14:00 - 16:00',
      venue: 'Lab Room A',
      category: 'Workshop',
      maxParticipants: 30,
      status: 'APPROVED',
      posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      facultyId: faculty.id
    }
  })

  await prisma.event.create({
    data: {
      title: 'Annual Tech Symposium',
      description: 'Join us for guest speakers, networking sessions, and tech showcases from industry leaders and student projects alike.',
      date: '2026-06-10',
      time: '09:00 - 17:00',
      venue: 'Main Auditorium',
      category: 'Technical',
      maxParticipants: 500,
      status: 'APPROVED',
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      facultyId: faculty.id
    }
  })

  await prisma.event.create({
    data: {
      title: 'Spring Festival 2026',
      description: 'Music, food trucks, and cultural performances all afternoon! Everyone is welcome for this campus-wide celebration.',
      date: '2026-04-25',
      time: '12:00 - 20:00',
      venue: 'Campus Quad',
      category: 'Cultural',
      maxParticipants: 1000,
      status: 'APPROVED',
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      facultyId: faculty.id
    }
  })

  // Create a PENDING event (awaiting admin approval)
  await prisma.event.create({
    data: {
      title: 'AI & Machine Learning for Beginners',
      description: 'An introductory session on the fundamentals of Artificial Intelligence and ML, open to all students regardless of background.',
      date: '2026-07-01',
      time: '10:00 - 12:00',
      venue: 'Seminar Hall B',
      category: 'Technical',
      maxParticipants: 80,
      status: 'PENDING',
      posterUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
      facultyId: faculty.id
    }
  })

  // Register student for the first event
  await prisma.registration.create({
    data: {
      studentId: student.id,
      eventId: event1.id
    }
  })

  console.log('Seeding finished successfully.')
  console.log('---')
  console.log('Demo Credentials:')
  console.log('  ADMIN    -> admin@demo.com / password123')
  console.log('  FACULTY  -> faculty@demo.com / password123')
  console.log('  STUDENT  -> student@demo.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
