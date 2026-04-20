"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, CheckCircle, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreateEventClient({ facultyId }: { facultyId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    category: 'Technical',
    maxParticipants: '',
    description: '',
    posterUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, facultyId })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/faculty')
        }, 1500)
      } else {
        alert("Error creating event")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-indigo-500/30">
      <header className="sticky top-0 z-40 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8">
        <Link href="/faculty" className="inline-flex items-center text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-neutral-400">Fill in the details below to publish a new event for students.</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Event Created Successfully!</h2>
            <p className="text-neutral-400">Redirecting you back to the dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-neutral-800/30 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Event Title</label>
                <input 
                  required
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                  placeholder="e.g. Intro to Machine Learning"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Date</label>
                  <input 
                    required
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Time</label>
                  <input 
                    required
                    type="text" 
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                    placeholder="e.g. 14:00 - 16:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Venue</label>
                  <input 
                    required
                    type="text" 
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                    placeholder="e.g. Lab Room 402"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Maximum Participants</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-full md:w-1/2 bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                  placeholder="e.g. 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600 resize-none"
                  placeholder="Describe the event details, requirements, etc."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Poster Image URL (Demo)</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input 
                      type="url" 
                      name="posterUrl"
                      value={formData.posterUrl}
                      onChange={handleChange}
                      className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-xl bg-neutral-800 border border-white/10 items-center justify-center text-neutral-500">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">In this demo, provide an Unsplash URL instead of actual file upload. Leave empty for a default image.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
              >
                {isLoading ? 'Creating...' : (
                  <>
                    <Save className="w-4 h-4" /> Publish Event
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
