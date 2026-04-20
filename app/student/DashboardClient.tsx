"use client"

import { useState } from 'react'
import { Search, Bell, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardClient({ initialEvents, studentId, registeredIds }: any) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')
  const [showRegisteredOnly, setShowRegisteredOnly] = useState(false)

  const categories = ['All', 'Workshop', 'Technical', 'Cultural']

  const filteredEvents = initialEvents.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filter === 'All' || event.category === filter
    const matchesRegistered = showRegisteredOnly ? registeredIds.includes(event.id) : true
    return matchesSearch && matchesCategory && matchesRegistered
  })

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Campus Events</h1>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
            ST
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search for events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{showRegisteredOnly ? 'My Registered Events' : 'Upcoming Events'}</h2>
          <button 
            onClick={() => setShowRegisteredOnly(!showRegisteredOnly)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${showRegisteredOnly ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-white/10 text-neutral-400 hover:text-white'}`}
          >
            My Registered Events
          </button>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => {
            const isRegistered = registeredIds.includes(event.id)
            return (
              <Link href={`/student/events/${event.id}`} key={event.id}>
                <div className="group bg-neutral-800/50 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]">
                  <div className="h-48 bg-neutral-800 relative overflow-hidden">
                    <img 
                      src={event.posterUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                      {event.category}
                    </div>
                    {isRegistered && (
                      <div className="absolute top-3 right-3 bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Registered
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-neutral-400 gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400/70" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-400 gap-2">
                        <Clock className="w-4 h-4 text-indigo-400/70" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-400 gap-2">
                        <MapPin className="w-4 h-4 text-indigo-400/70" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs font-medium text-neutral-500">By {event.facultyName}</span>
                      <span className="text-sm font-semibold text-indigo-400">View Details →</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          
          {filteredEvents.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-white/10 rounded-2xl">
              No events found matching your criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
