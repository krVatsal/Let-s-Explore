import React from 'react';
import { Calendar, Clock, MapPin, Users, Star, Trophy } from 'lucide-react';

interface EventCardProps {
  type: 'upcoming' | 'live';
  name: string; // Changed from title to name for consistency with the schema
  description: string;
  startTime: string;
  endTime: string;
  location: { coordinates: number[] }; // Assuming location contains coordinates
  participants: number; // Updated to reflect participants count
}

export default function EventCard({
  type,
  name,
  description,
  startTime,
  endTime,
  location,
  participants,
}: EventCardProps) {
  return (
    <div className="game-card group">
      <div className="absolute -right-16 -top-16 transform rotate-45 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-300" />
      
      <div className="p-6 relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          </div>
          {type === 'live' && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-medium animate-[bounce_1s_ease-in-out_infinite]">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>Live Now!</span>
            </div>
          )}
        </div>
        
        <p className="mt-3 text-gray-600">{description}</p>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors">
            <Clock className="w-5 h-5 mr-2" />
            <span>{new Date(startTime).toLocaleString()} - {new Date(endTime).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{`Lat: ${location.coordinates[1]}, Lon: ${location.coordinates[0]}`}</span>
          </div>
          
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors">
            <Users className="w-5 h-5 mr-2" />
            <span>{participants} adventurers joined</span>
          </div>
        </div>
        
        <button
          className={`fun-button mt-4 w-full py-3 px-4 rounded-lg text-white
            ${type === 'live'
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            }`}
        >
          {type === 'live' ? '🎮 Join Adventure!' : '🎯 Ready to Play!'}
        </button>
      </div>
    </div>
  );
}
