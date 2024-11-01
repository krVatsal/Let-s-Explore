"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Image, Lightbulb, PlusCircle, Sparkles } from 'lucide-react';

export default function CreateEventForm() {
  // State for managing form inputs
  const [questName, setQuestName] = useState('');
  const [questDescription, setQuestDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questLocation, setQuestLocation] = useState('');
  const [challenges, setChallenges] = useState([{ title: '', hints: ['', ''], photoTask: '' }]); // Array for dynamic challenges

  const handleChallengeChange = (index, value) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].title = value;
    setChallenges(updatedChallenges);
  };

  const handleHintChange = (challengeIndex, hintIndex, value) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex].hints[hintIndex] = value;
    setChallenges(updatedChallenges);
  };

  const addHint = (challengeIndex) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex].hints.push(''); // Add a new empty hint
    setChallenges(updatedChallenges);
  };

  const handlePhotoTaskChange = (index, value) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index].photoTask = value;
    setChallenges(updatedChallenges);
  };

  const addChallenge = () => {
    setChallenges([...challenges, { title: '', hints: ['', ''], photoTask: '' }]); // Add a new empty challenge
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    console.log({
      questName,
      questDescription,
      startTime,
      endTime,
      questLocation,
      challenges,
    });
  };

  return (
    <div className="game-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-7 h-7 text-yellow-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Create Adventure
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-indigo-600 mb-1">Quest Name</label>
          <input
            type="text"
            value={questName}
            onChange={(e) => setQuestName(e.target.value)}
            className="block w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
            placeholder="Name your adventure..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-600 mb-1">Quest Description</label>
          <textarea
            rows={3}
            value={questDescription}
            onChange={(e) => setQuestDescription(e.target.value)}
            className="block w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
            placeholder="Describe the exciting journey..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-indigo-600 mb-1">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full pl-10 rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-indigo-600 mb-1">End Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full pl-10 rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-600 mb-1">Quest Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
            <input
              type="text"
              value={questLocation}
              onChange={(e) => setQuestLocation(e.target.value)}
              className="block w-full pl-10 rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
              placeholder="Choose your battleground..."
            />
          </div>
          <div className="mt-2 h-48 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-300 transition-colors">
            <div className="h-full flex items-center justify-center text-indigo-400">
              Click to set quest location
            </div>
          </div>
        </div>

        {/* Dynamic Challenges Section */}
        <div>
          <label className="block text-sm font-bold text-indigo-600 mb-1">Challenges</label>
          {challenges.map((challenge, challengeIndex) => (
            <div key={challengeIndex} className="mb-4">
              <input
                type="text"
                value={challenge.title}
                onChange={(e) => handleChallengeChange(challengeIndex, e.target.value)}
                className="block w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all mb-2"
                placeholder={`Challenge #${challengeIndex + 1}`}
              />

              {/* Dynamic Hints Section */}
              <label className="block text-sm font-bold text-indigo-600 mb-1">Hints</label>
              {challenge.hints.map((hint, hintIndex) => (
                <div key={hintIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => handleHintChange(challengeIndex, hintIndex, e.target.value)}
                    className="block w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                    placeholder={`Hint #${hintIndex + 1}`}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addHint(challengeIndex)} // Adding new hint
                className="fun-button flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add Hint</span>
              </button>

              {/* Photo Task Input */}
              <div>
                <label className="block text-sm font-bold text-indigo-600 mb-1">Photo Task</label>
                <input
                  type="text"
                  value={challenge.photoTask}
                  onChange={(e) => handlePhotoTaskChange(challengeIndex, e.target.value)}
                  className="block w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
                  placeholder="Photo Task..."
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addChallenge}
            className="fun-button flex items-center space-x-2 text-indigo-600 hover:text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg w-full"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Challenge</span>
          </button>
          </div>

{/* Submit Button */}
<div>
  <button
    type="submit"
    className="submit-button w-full py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
  >
    Create Adventure
  </button>
</div>
</form>
</div>
);
}

