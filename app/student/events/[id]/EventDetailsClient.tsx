"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, User, ArrowLeft, CheckCircle, AlertCircle, Users } from 'lucide-react'
import Link from 'next/link'

export default function EventDetailsClient({ event, studentId, isInitiallyRegistered, registrationCount: initialCount }: any) {
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(isInitiallyRegistered)
  const [registrationCount, setRegistrationCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const isFull = registrationCount >= event.maxParticipants

  const handleRegister = async () => {
    if (isRegistered || isFull) return
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, eventId: event.id })
      })
      
      if (res.ok) {
        setIsRegistered(true)
        setRegistrationCount(registrationCount + 1)
        setShowSuccessModal(true)
      } else {
        alert('Failed to register')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-indigo-500/30">
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-neutral-800 border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Successfully Registered!</h3>
            <p className="text-neutral-400 text-sm mb-6">You're all set to attend {event.title}. A notification will be sent before the event starts.</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false)
                router.push('/student')
              }}
              className="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8">
        <Link href="/student" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:px-8">
        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative border border-white/5">
          <img 
            src={event.posterUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <div className="flex gap-2 mb-3">
              <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{event.category}</span>
              {isRegistered && <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Registered</span>}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Details Section */}
            <section className="bg-neutral-800/30 rounded-2xl p-6 md:p-8 border border-white/5">
              <h2 className="text-xl font-semibold mb-4 text-white">About the Event</h2>
              <p className="text-neutral-300 leading-relaxed text-lg whitespace-pre-wrap">{event.description}</p>
            </section>
          </div>

          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-neutral-800/50 rounded-2xl p-6 border border-white/10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Date</p>
                    <p className="font-semibold text-white">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Time</p>
                    <p className="font-semibold text-white">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Venue</p>
                    <p className="font-semibold text-white">{event.venue}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Organizer</p>
                    <p className="font-semibold text-white">{event.facultyName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-neutral-700/50 p-3 rounded-lg text-neutral-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-neutral-400">Availability</p>
                      <span className="text-xs font-medium text-neutral-500">{registrationCount} / {event.maxParticipants}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((registrationCount / event.maxParticipants) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                {isRegistered ? (
                  <div className="w-full py-4 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex justify-center items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> You are registered
                  </div>
                ) : isFull ? (
                  <div className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold border border-red-500/20 flex justify-center items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Event is Full
                  </div>
                ) : (
                  <button 
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] flex justify-center items-center"
                  >
                    {isLoading ? 'Registering...' : 'Register Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
