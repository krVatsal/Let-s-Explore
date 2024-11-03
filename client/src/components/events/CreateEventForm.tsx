"use client";

import { useState } from 'react';
import { Calendar, Clock, MapPin, Image as ImageIcon, Lightbulb, PlusCircle, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PuzzleMap } from '@/components/puzzle/PuzzleMap';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component for toggling

type Challenge = {
  description: string;
  hints: string[];
  location: { lat: number; lng: number } | null;
  image: string | null;
  difficulty: string;
  isImageRequired: boolean;
};

export default function CreateEventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [challenges, setChallenges] = useState<Challenge[]>([{
    description: '',
    hints: ['', ''],
    location: null,
    image: null,
    difficulty: 'medium',
    isImageRequired: false,
  }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedChallenges = challenges.map(challenge => ({
      description: challenge.description,
      hints: challenge.hints,
      location: challenge.location,
      image: challenge.image,
      difficulty: challenge.difficulty,
      isImageRequired: challenge.isImageRequired,
    }));

    console.log('Formatted Challenges:', formattedChallenges);
    // Add your backend submission logic here
  };

  const addChallenge = () => {
    setChallenges([...challenges, {
      description: '',
      hints: ['', ''],
      location: null,
      image: null,
      difficulty: 'medium',
      isImageRequired: false,
    }]);
  };

  const updateChallenge = (index: number, field: keyof Challenge, value: any) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index] = { ...updatedChallenges[index], [field]: value };
    setChallenges(updatedChallenges);
  };

  const updateHint = (challengeIndex: number, hintIndex: number, value: string) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex].hints[hintIndex] = value;
    setChallenges(updatedChallenges);
  };

  return (
    <div className="glass-card p-6 sticky top-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-7 h-7 text-emerald-500" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
          Create Hunt
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Hunt Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background/50 border-emerald-500/20"
          />

          <Textarea
            placeholder="Hunt Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/50 border-emerald-500/20 min-h-[100px]"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background/50 border-emerald-500/20"
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background/50 border-emerald-500/20"
              />
            </div>
          </div>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-background/50 border-emerald-500/20">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {challenges.map((challenge, challengeIndex) => (
            <div key={challengeIndex} className="p-4 border border-emerald-500/20 rounded-lg space-y-4">
              <h3 className="font-semibold text-emerald-400">Challenge #{challengeIndex + 1}</h3>
              
              <Textarea
                placeholder="Challenge Description"
                value={challenge.description}
                onChange={(e) => updateChallenge(challengeIndex, 'description', e.target.value)}
                className="bg-background/50 border-emerald-500/20"
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-400">Hints</p>
                {challenge.hints.map((hint, hintIndex) => (
                  <Input
                    key={hintIndex}
                    placeholder={`Hint ${hintIndex + 1}`}
                    value={hint}
                    onChange={(e) => updateHint(challengeIndex, hintIndex, e.target.value)}
                    className="bg-background/50 border-emerald-500/20"
                  />
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-400">Location</p>
                <PuzzleMap
                  selectedLocation={challenge.location}
                  onLocationSelect={(loc) => updateChallenge(challengeIndex, 'location', loc)}
                />
              </div>

              <div className="flex items-center gap-4">
             

                <div className="flex items-center">
                  <span className="text-sm text-emerald-400 mr-2">Image Required</span>
                  <Switch
                    checked={challenge.isImageRequired}
                    onCheckedChange={(checked) => updateChallenge(challengeIndex, 'isImageRequired', checked)}
                    className="bg-background/50 border-emerald-500/20"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-emerald-500/20"
            onClick={addChallenge}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Challenge
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500"
        >
          Create Hunt
        </Button>
      </form>
    </div>
  );
}
