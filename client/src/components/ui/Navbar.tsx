import React from 'react';
import { MapIcon } from '@heroicons/react/24/outline'; // Updated import path

export default function Navbar() { // Add parentheses here
  return (
    <nav className="border-b border-emerald-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapIcon className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-bold">MNNITHunt</span>
        </div>
      </div>
    </nav>
  );
}
