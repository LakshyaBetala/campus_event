import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // In a real app use bcrypt.compare(). For this demo, plaintext match.
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password. Please try again.' }, { status: 401 })
    }

    // Return safe user info (never the passwordHash in a real app)
    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
