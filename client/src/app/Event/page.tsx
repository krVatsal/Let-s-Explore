"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { EventCard } from "@/components/events/EventCard";
import CreateEventForm from "@/components/events/CreateEventForm";

// API endpoints for fetching events
const LIVE_EVENTS_API_URL = "/api/v1/liveHunts"; // Endpoint for live events
const UPCOMING_EVENTS_API_URL = "/api/v1/upcomingHunts"; // Endpoint for upcoming events

export default function EventsPage() {
  const [liveEvents, setLiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorLive, setErrorLive] = useState(null);
  const [errorUpcoming, setErrorUpcoming] = useState(null);

  useEffect(() => {
    const fetchLiveEvents = async () => {
      setLoadingLive(true);
      try {
        const response = await fetch(LIVE_EVENTS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch live events.");
        }
        const data = await response.json();
        setLiveEvents(data); // Assuming data is an array of live events
      } catch (err) {
        setErrorLive(err.message);
      } finally {
        setLoadingLive(false);
      }
    };

    const fetchUpcomingEvents = async () => {
      setLoadingUpcoming(true);
      try {
        const response = await fetch(UPCOMING_EVENTS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming events.");
        }
        const data = await response.json();
        setUpcomingEvents(data); // Assuming data is an array of upcoming events
      } catch (err) {
        setErrorUpcoming(err.message);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    fetchLiveEvents();
    fetchUpcomingEvents();
  }, []);

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
                {loadingLive && <div className="text-center text-lg">Loading live events...</div>}
                {errorLive && <div className="text-center text-red-500">{errorLive}</div>}
                {!loadingLive && !errorLive && (
                  <div className="grid gap-6">
                    {liveEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
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
                {loadingUpcoming && <div className="text-center text-lg">Loading upcoming events...</div>}
                {errorUpcoming && <div className="text-center text-red-500">{errorUpcoming}</div>}
                {!loadingUpcoming && !errorUpcoming && (
                  <div className="grid gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
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
