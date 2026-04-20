"use client"

import { ArrowLeft, Download, Users, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Participant {
  sNo: number
  name: string
  studentId: string
  email: string
  registeredAt: string
}

interface EventInfo {
  id: string
  title: string
  date: string
  venue: string
  maxParticipants: number
}

export default function ParticipantListClient({
  event,
  participants,
}: {
  event: EventInfo
  participants: Participant[]
}) {
  const handleDownloadCSV = () => {
    // Trigger CSV download via the API
    window.open(`/api/faculty/participants?eventId=${event.id}&format=csv`, '_blank')
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex items-center justify-between gap-4">
        <Link href="/faculty" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-sm font-semibold text-neutral-300 hidden md:block truncate">{event.title}</h1>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-8">
        {/* Event Summary */}
        <div className="bg-neutral-800/30 border border-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{event.title}</h2>
          <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" /> {event.date}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" /> {event.venue}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>
                <span className={`font-bold ${participants.length >= event.maxParticipants ? 'text-red-400' : 'text-emerald-400'}`}>
                  {participants.length}
                </span>
                <span className="text-neutral-500"> / {event.maxParticipants} registered</span>
              </span>
            </div>
          </div>
        </div>

        {/* Participant Table */}
        <div className="bg-neutral-800/30 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-200">Registered Participants</h3>
            <span className="text-sm text-neutral-500">{participants.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-800/50 text-neutral-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">Student Name</th>
                  <th className="px-6 py-3 font-medium">Student ID</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Email</th>
                  <th className="px-6 py-3 font-medium hidden lg:table-cell">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.studentId} className="border-t border-white/5 hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-4 text-neutral-500 text-sm">{p.sNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-neutral-900/50 px-2 py-1 rounded text-neutral-400">
                        {p.studentId.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-sm hidden md:table-cell">{p.email}</td>
                    <td className="px-6 py-4 text-neutral-500 text-xs hidden lg:table-cell">
                      {new Date(p.registeredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {participants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-neutral-500">
                      <Users className="w-10 h-10 mx-auto mb-3 text-neutral-700" />
                      <p className="text-base">No students have registered yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
