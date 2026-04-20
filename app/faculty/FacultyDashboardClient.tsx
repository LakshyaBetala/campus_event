"use client"

import { Plus, Users, Calendar, MapPin, MoreVertical } from 'lucide-react'
import Link from 'next/link'

export default function FacultyDashboardClient({ events, facultyName }: any) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Campus Events - Faculty Hub</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-neutral-400 hidden md:block">Welcome, {facultyName}</div>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
            FA
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Event Dashboard</h2>
          <Link href="/faculty/create">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-6">
            <div className="text-neutral-400 text-sm mb-2">Total Events</div>
            <div className="text-3xl font-bold">{events.length}</div>
          </div>
          <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-6">
            <div className="text-neutral-400 text-sm mb-2">Total Registrations</div>
            <div className="text-3xl font-bold text-indigo-400">{events.reduce((acc: number, e: any) => acc + e.registrations.length, 0)}</div>
          </div>
          <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-6">
            <div className="text-neutral-400 text-sm mb-2">Registration Rate</div>
            <div className="text-3xl font-bold text-emerald-400">
              {events.length > 0 
                ? Math.round((events.reduce((acc: number, e: any) => acc + e.registrations.length, 0) / events.reduce((acc: number, e: any) => acc + e.maxParticipants, 0)) * 100) 
                : 0}%
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-6 pb-2 text-neutral-200">My Managed Events & Reports</h3>
        
        <div className="bg-neutral-800/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-800 border-b border-white/10 text-neutral-400 text-sm">
                  <th className="p-4 font-medium whitespace-nowrap">Event Name</th>
                  <th className="p-4 font-medium hidden md:table-cell whitespace-nowrap">Date & Venue</th>
                  <th className="p-4 font-medium whitespace-nowrap">Registrations</th>
                  <th className="p-4 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event: any) => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-neutral-800/50 transition-colors">
                    <td className="p-4 min-w-[200px]">
                      <div className="font-semibold text-white mb-1.5">{event.title}</div>
                      <div className="text-xs text-neutral-300 font-medium inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                        {event.category}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell min-w-[200px]">
                      <div className="flex items-center text-sm text-neutral-300 gap-2 mb-1.5">
                        <Calendar className="w-4 h-4 text-neutral-500" /> {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-sm text-neutral-400 gap-2">
                        <MapPin className="w-4 h-4 text-neutral-500" /> {event.venue}
                      </div>
                    </td>
                    <td className="p-4 min-w-[150px]">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {event.registrations.slice(0, 3).map((r: any, i: number) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm border-2 border-neutral-800 flex justify-center items-center text-xs font-bold text-white" title={r.student.name}>
                              {r.student.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm font-semibold text-neutral-300 bg-neutral-900/50 px-2 py-1 rounded-md">
                          {event.registrations.length} / {event.maxParticipants}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-neutral-500">
                      <div className="flex justify-center mb-4">
                        <Calendar className="w-12 h-12 text-neutral-600" />
                      </div>
                      <p className="text-lg">You haven't created any events yet.</p>
                      <p className="text-sm mt-1">Click "Create Event" to get started.</p>
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
