"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import EventCard from "@/components/ui/EventCard";
import CreateEventForm from "@/components/ui/CreateEventForm";
import LeaderboardModal from "@/components/ui/LeaderboardModal";

export default function App() {
  const [liveEvents, setLiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch events data from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const liveHunts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/liveHunts`);
        const livedata = await liveHunts.json();

        const upcomingHunts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomingHunts`);
        const upcomingdata = await upcomingHunts.json();

        setLiveEvents(livedata || []);
        setUpcomingEvents(upcomingdata || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=2000&h=1000&blur=50')] mix-blend-overlay opacity-10 bg-cover bg-center" />

      <div className="relative">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Event Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Live Events Section */}
              <section className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-2">Live Events</h2>
                <div className="grid gap-6">
                  {liveEvents.length > 0 ? (
                    liveEvents.map((event, index) => (
                      <EventCard key={index} type="live" {...event} />
                    ))
                  ) : (
                    <p className="text-gray-600">No live events currently available.</p>
                  )}
                </div>
              </section>

              {/* Upcoming Events Section */}
              <section className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">Upcoming Events</h2>
                <div className="grid gap-6">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, index) => (
                      <EventCard key={index} type="upcoming" {...event} />
                    ))
                  ) : (
                    <p className="text-gray-600">No upcoming events available.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
           
              <CreateEventForm />
          
          </div>
        </main>
      </div>
    </div>
  );
}
