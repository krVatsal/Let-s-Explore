"use client";

import { useState, useContext } from 'react';
import { Calendar, Clock, MapPin, Image as ImageIcon, Lightbulb, PlusCircle, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PuzzleMap } from '@/components/puzzle/PuzzleMap';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch'; // Assuming you have a Switch component for toggling
import axios from 'axios';
import  {AuthContext}  from '@/app/context/AuthContext'; // Assuming you have an AuthContext

type Puzzle = {
  puzzleText: string;
  hints: string[];
  location: { coordinates: [number, number] } | null;
  photoReq: boolean;
};

export default function CreateEventForm() {
  const [name, setName] = useState(''); // Renamed from title to name
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [difficulty, setdifficulty] = useState('medium');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([{
    puzzleText: '',
    hints: ['', ''],
    location: null,
    photoReq: false,
  }]);

  const { user } = useContext(AuthContext); // Assuming you have user info in AuthContext
console.log(user);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validation
    if (!name.trim() || !description.trim() || !startTime || !endTime || !difficulty) {
      alert("Please fill in all required fields.");
      return;
    }

    if (puzzles.length === 0) {
      alert("At least one puzzle is required.");
      return;
    }

    for (let i = 0; i < puzzles.length; i++) {
      const puzzle = puzzles[i];
      if (!puzzle.puzzleText.trim()) {
        alert(`Puzzle ${i + 1}: Puzzle text is required.`);
        return;
      }
      // if (!puzzle.location || !puzzle.location.coordinates || puzzle.location.coordinates.length !== 2) {
      //   alert(`Puzzle ${i + 1}: Valid location is required.`);
      //   return;
      // }
      if (!Array.isArray(puzzle.hints) || puzzle.hints.length === 0) {
        alert(`Puzzle ${i + 1}: At least one hint is required.`);
        return;
      }
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("Start time must be before end time.");
      return;
    }

    // Prepare Data for Backend
    const huntData = {
      name,
      description,
      puzzles,
      startTime,
      endTime,
      createdBy: user?.id || "UnknownUser", // Ensure you have user information
      level : difficulty,
    };

    console.log('Formatted Hunt Data:', huntData);

    try {
      const response = await axios.post('/api/v1/createHunt', huntData);
      console.log("Hunt created successfully", response.data);
      // Optionally, reset the form or redirect the user
    } catch (error) {
      console.error("Error creating hunt:", error);
      alert("There was an error creating the hunt. Please try again.");
    }
  };

  const addPuzzle = () => {
    setPuzzles([...puzzles, {
      puzzleText: '',
      hints: ['', ''],
      location: null,
      photoReq: false,
    }]);
  };

  const updatePuzzle = (index: number, field: keyof Puzzle, value: any) => {
    const updatedPuzzles = [...puzzles];
    updatedPuzzles[index] = { ...updatedPuzzles[index], [field]: value };
    setPuzzles(updatedPuzzles);
  };

  const updateHint = (puzzleIndex: number, hintIndex: number, value: string) => {
    const updatedPuzzles = [...puzzles];
    if (!updatedPuzzles[puzzleIndex].hints) {
      updatedPuzzles[puzzleIndex].hints = [];
    }
    updatedPuzzles[puzzleIndex].hints[hintIndex] = value;
    setPuzzles(updatedPuzzles);
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
            placeholder="Hunt Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/50 border-emerald-500/20"
            required
          />

          <Textarea
            placeholder="Hunt Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/50 border-emerald-500/20 min-h-[100px]"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background/50 border-emerald-500/20"
                required
              />
            </div>

            <div>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background/50 border-emerald-500/20"
                required
              />
            </div>
          </div>

          <Select value={difficulty} onValueChange={setdifficulty}>
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
          {puzzles.map((puzzle, puzzleIndex) => (
            <div key={puzzleIndex} className="p-4 border border-emerald-500/20 rounded-lg space-y-4">
              <h3 className="font-semibold text-emerald-400">Puzzle #{puzzleIndex + 1}</h3>

              <Textarea
                placeholder="Puzzle Text"
                value={puzzle.puzzleText}
                onChange={(e) => updatePuzzle(puzzleIndex, 'puzzleText', e.target.value)}
                className="bg-background/50 border-emerald-500/20"
                required
              />

              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-400">Hints</p>
                {puzzle.hints.map((hint, hintIndex) => (
                  <Input
                    key={hintIndex}
                    placeholder={`Hint ${hintIndex + 1}`}
                    value={hint}
                    onChange={(e) => updateHint(puzzleIndex, hintIndex, e.target.value)}
                    className="bg-background/50 border-emerald-500/20"
                    required
                  />
                ))}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    const updatedPuzzles = [...puzzles];
                    updatedPuzzles[puzzleIndex].hints.push('');
                    setPuzzles(updatedPuzzles);
                  }}
                >
                  Add Another Hint
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-400">Location</p>
                <PuzzleMap
                  selectedLocation={puzzle.location}
                  onLocationSelect={(loc) => updatePuzzle(puzzleIndex, 'location', loc)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-emerald-400 mr-2">Image Required</span>
                  <Switch
                    checked={puzzle.photoReq}
                    onCheckedChange={(checked) => updatePuzzle(puzzleIndex, 'photoReq', checked)}
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
            onClick={addPuzzle}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Puzzle
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
