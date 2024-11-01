import React from 'react';
import { Compass, Map, Trophy } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute transform -rotate-6 -translate-x-1/4 -translate-y-1/4">
          <Map className="w-96 h-96 text-white/5" />
        </div>
        <div className="absolute right-0 top-0 transform rotate-12 translate-x-1/4 -translate-y-1/4">
          <Compass className="w-72 h-72 text-white/5" />
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Embark on Epic Campus Adventures!
            </h1>
            <p className="text-xl text-indigo-100">
              Join thrilling treasure hunts, solve mysterious puzzles, and compete with fellow adventurers in real-time quests around campus.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="fun-button px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50">
                Start Quest
              </button>
              <button className="fun-button px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400">
                Watch Tutorial
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1596496050827-8299e0220de1?auto=format&fit=crop&q=80&w=800&h=600"
                alt="Treasure hunt"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-2 text-white">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">32 Active Quests Today</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-yellow-400 rounded-2xl -z-10 animate-pulse opacity-20"></div>
            <div className="absolute -left-4 -top-4 w-32 h-32 bg-purple-400 rounded-2xl -z-10 animate-pulse opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}