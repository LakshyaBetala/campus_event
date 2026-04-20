import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (!data.title || !data.facultyId || !data.date || !data.venue) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        date: data.date,
        time: data.time || '',
        venue: data.venue,
        category: data.category || 'Technical',
        maxParticipants: parseInt(data.maxParticipants) || 50,
        posterUrl: data.posterUrl || null,
        status: 'PENDING', // All faculty-created events start as PENDING
        facultyId: data.facultyId
      }
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
