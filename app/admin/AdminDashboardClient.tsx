"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Users, CalendarDays, ClipboardList, CheckCircle, XCircle, Clock, MapPin, Calendar, User, Loader2 } from 'lucide-react'

interface Analytics {
  totalUsers: number
  totalEvents: number
  totalRegistrations: number
}

interface PendingEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  category: string
  maxParticipants: number
  description: string
  facultyName: string
  createdAt: Date | string
}

export default function AdminDashboardClient({
  initialPendingEvents,
  analytics,
}: {
  initialPendingEvents: PendingEvent[]
  analytics: Analytics
}) {
  const router = useRouter()
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>(initialPendingEvents)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAction = async (eventId: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(eventId)
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      })
      if (res.ok) {
        setPendingEvents(prev => prev.filter(e => e.id !== eventId))
        // Refresh real-time analytics by reloading (lightweight solution for demo)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessingId(null)
    }
  }

  const CATEGORY_COLORS: Record<string, string> = {
    Workshop: 'bg-amber-500/20 text-amber-300',
    Technical: 'bg-blue-500/20 text-blue-300',
    Cultural: 'bg-pink-500/20 text-pink-300',
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            Admin Control Panel
          </h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm">AD</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">

        {/* US05 — System Analytics */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-neutral-300 mb-4">System Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-neutral-400">Total Users</p>
                <p className="text-3xl font-bold text-white">{analytics.totalUsers}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400"><CalendarDays className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-neutral-400">Total Events</p>
                <p className="text-3xl font-bold text-white">{analytics.totalEvents}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400"><ClipboardList className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-neutral-400">Total Registrations</p>
                <p className="text-3xl font-bold text-white">{analytics.totalRegistrations}</p>
              </div>
            </div>
          </div>
        </section>

        {/* US04 — Pending Approvals */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">Pending Event Approvals</h2>
            {pendingEvents.length > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                {pendingEvents.length} awaiting
              </span>
            )}
          </div>

          {pendingEvents.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
              <p className="text-neutral-400 text-lg font-medium">All clear! No pending events.</p>
              <p className="text-neutral-600 text-sm mt-1">New faculty submissions will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-neutral-800/40 border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[event.category] || 'bg-neutral-700 text-neutral-300'}`}>
                          {event.category}
                        </span>
                        <span className="text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Calendar className="w-4 h-4 text-neutral-600" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <MapPin className="w-4 h-4 text-neutral-600" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Users className="w-4 h-4 text-neutral-600" />
                          <span>Max {event.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <User className="w-4 h-4 text-neutral-600" />
                          <span>{event.facultyName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-3 shrink-0">
                      <button
                        onClick={() => handleAction(event.id, 'APPROVED')}
                        disabled={processingId === event.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold rounded-xl border border-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {processingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(event.id, 'REJECTED')}
                        disabled={processingId === event.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {processingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
