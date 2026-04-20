import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        venue: data.venue,
        category: data.category,
        maxParticipants: parseInt(data.maxParticipants),
        posterUrl: data.posterUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60`,
        facultyId: data.facultyId
      }
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
