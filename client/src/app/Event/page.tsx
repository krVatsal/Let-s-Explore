"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import {EventCard} from "@/components/events/EventCard";
import CreateEventForm from "@/components/events/CreateEventForm";

// Dummy data for events
const DUMMY_LIVE_EVENTS = [
  {
    id: 1,
    title: "Library Quest",
    description: "Explore the hidden corners of MNNIT's central library in this exciting treasure hunt!",
    startTime: "2024-03-20T10:00:00",
    endTime: "2024-03-20T12:00:00",
    location: "Central Library",
    participants: 42,
    totalPuzzles: 5,
    difficulty: "Medium",
    status: "live"
  },
  {
    id: 2,
    title: "Tech Trail",
    description: "A thrilling hunt through MNNIT's computer science department. Solve puzzles and discover tech history!",
    startTime: "2024-03-20T11:00:00",
    endTime: "2024-03-20T13:00:00",
    location: "CS Department",
    participants: 28,
    totalPuzzles: 4,
    difficulty: "Hard",
    status: "live"
  }
];

const DUMMY_UPCOMING_EVENTS = [
  {
    id: 3,
    title: "Garden Mysteries",
    description: "Uncover the secrets hidden in MNNIT's botanical gardens. Perfect for nature lovers!",
    startTime: "2024-03-25T14:00:00",
    endTime: "2024-03-25T16:00:00",
    location: "Botanical Garden",
    participants: 15,
    totalPuzzles: 3,
    difficulty: "Easy",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Sports Complex Challenge",
    description: "An adventurous hunt around MNNIT's sports facilities. Test your knowledge of sports!",
    startTime: "2024-03-26T09:00:00",
    endTime: "2024-03-26T11:00:00",
    location: "Sports Complex",
    participants: 20,
    totalPuzzles: 6,
    difficulty: "Medium",
    status: "upcoming"
  }
];

export default function EventsPage() {
  const [liveEvents, setLiveEvents] = useState(DUMMY_LIVE_EVENTS);
  const [upcomingEvents, setUpcomingEvents] = useState(DUMMY_UPCOMING_EVENTS);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=2000&h=1000&blur=50')] mix-blend-overlay opacity-5 bg-cover bg-center" />

      <div className="relative">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Event Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Live Events Section */}
              <section className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
                    Live Events
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
                    {liveEvents.length} Active
                  </span>
                </div>
                <div className="grid gap-6">
                  {liveEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              {/* Upcoming Events Section */}
              <section className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 text-transparent bg-clip-text">
                    Upcoming Events
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 text-sm font-medium border border-sky-500/20">
                    {upcomingEvents.length} Scheduled
                  </span>
                </div>
                <div className="grid gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            </div>

            {/* Create Event Form */}
            <div className="lg:col-span-1">
              <CreateEventForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}