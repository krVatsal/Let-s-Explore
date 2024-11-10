"use client"
import { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { Calendar, Clock, Lightbulb, PlusCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { AuthContext } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import { useToast } from "@/hooks/use-toast";
type Puzzle = {
  puzzleText: string;
  hints: string[];
  location: { 
    coordinates: [number, number];
    popupText?: string;
  } | null;
  photoReq: boolean;
};

export default function CreateEventForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzles, setPuzzles] = useState<Puzzle[]>([{
    puzzleText: '',
    hints: ['', ''],
    location: null,
    photoReq: false,
  }]);
const toast = useToast()
  const Map = useMemo(() => dynamic(
    () => import('./Map'),
    { 
      loading: () => <p>Loading Map...</p>,
      ssr: false
    }
  ), []);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not available.");
  }

  const { user, setUser } = authContext;

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
    } else {
      console.log("User is not logged in");
    }
  }, [user]);

  const customLocations = [
    {
      coordinates: [25.494249, 81.866397],
      popupText: "Bridge Boys Hostel",
  },
  {
      coordinates: [25.492735, 81.865756],
      popupText: "Boys Gym",
  },
  {
      coordinates: [25.492309, 81.866085],
      popupText: "Basketball MP Hall",
  },
  {
      coordinates: [25.494251, 81.866399],
      popupText: "Roller Skating Ring",
  },
  {
      coordinates: [25.491584, 81.866126],
      popupText: "MP Hall",
  },
  {
      coordinates: [25.491521, 81.866387],
      popupText: "Saraswati Gate",
  },
  {
      coordinates: [25.491827, 81.865046],
      popupText: "Hanuman Mandir",
  },
  {
      coordinates: [25.491138, 81.864701],
      popupText: "MNNIT Electricity Hub",
  },
  {
      coordinates: [25.490842, 81.864305],
      popupText: "School of Management Studies",
  },
  {
      coordinates: [25.491099, 81.864312],
      popupText: "CSED",
  },
  {
      coordinates: [25.490871, 81.863708],
      popupText: "PG Hostel Girls",
  },
  {
      coordinates: [25.492046, 81.862091],
      popupText: "Design Center",
  },
  {
      coordinates: [25.492180, 81.862964],
      popupText: "Center of Interdisciplinary Research",
  },
  {
      coordinates: [25.492327, 81.862361],
      popupText: "Seminar Hall",
  },
  {
      coordinates: [25.492362, 81.862934],
      popupText: "Dean Academics",
  },
    {
        coordinates: [25.49305, 81.866806],
        popupText: "Railway line and boys hostel underpass",
    },
    {
        coordinates: [25.495583, 81.867361],
        popupText: "Mess staff",
    },
    {
        coordinates: [25.494917, 81.867667],
        popupText: "SAC boys",
    },
    {
        coordinates: [25.494833, 81.867444],
        popupText: "Canteen Raj, Pillai",
    },
    {
        coordinates: [25.494583, 81.868806],
        popupText: "Tirath Raj Canteen",
    },
    {
        coordinates: [25.493694, 81.867611],
        popupText: "Patel Hostel",
    },
    {
        coordinates: [25.494222, 81.868139],
        popupText: "Tilak Hostel",
    },
    {
        coordinates: [25.495278, 81.868889],
        popupText: "Malviya Hostel",
    },
    {
        coordinates: [25.495667, 81.868139],
        popupText: "Tandon Hostel",
    },
    {
        coordinates: [25.496111, 81.868972],
        popupText: "NBH",
    },
    {
        coordinates: [25.493611, 81.86825],
        popupText: "Patel Hostel Gate",
    },
    {
        coordinates: [25.496389, 81.868139],
        popupText: "NBH Hostel Gate",
    },
    {
        coordinates: [25.494889, 81.868083],
        popupText: "Mess Common",
    },
    // Newly Added Locations
    {
        coordinates: [25.492745, 81.862819],
        popupText: "Svbh Chauraha",
    },
    {
        coordinates: [25.492767, 81.861182],
        popupText: "Ganga Gate",
    },
    {
        coordinates: [25.493550, 81.861855],
        popupText: "Admin Back Garden",
    },
    {
        coordinates: [25.494357, 81.861607],
        popupText: "Yamuna Gate",
    },
    {
        coordinates: [25.494548, 81.862384],
        popupText: "Yamuna Cafe",
    },
    {
        coordinates: [25.4942713, 81.8626992],
        popupText: "Gyan Shop",
    },
    {
        coordinates: [25.494983, 81.864645],
        popupText: "Athletic Ground",
    },
    {
        coordinates: [25.4944852, 81.8657703],
        popupText: "Swimming Pool",
    },
    {
        coordinates: [25.493886, 81.865829],
        popupText: "Basketball Court",
    },
];


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !startTime || !endTime || !difficulty) {
      alert("Please fill in all required fields.");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("Start time must be before end time.");
      return;
    }
    const formattedPuzzles = puzzles.map((puzzle) => ({
      ...puzzle,
      hints: puzzle.hints.map((hint) => ({ hint })),
  }));

    const huntData = {
      name,
      description,
      puzzles: formattedPuzzles,
      startTime,
      endTime,
      createdBy: user?._id || "UnknownUser",
      level: difficulty,
    };

    try {
      const response = await axios.post('http://localhost:5217/api/v1/createHunt', huntData);
      console.log("Hunt created successfully", response.data);
      if(response.status==200){
        toast({
          title: "New Hunt created",
          description: "Refresh to add it to the page",
        });
      }
    } catch (error) {
      console.error("Error creating hunt:", error);
      alert("There was an error creating the hunt. Please try again.");
    }
  }, [name, description, startTime, endTime, difficulty, puzzles, user?._id]);

  const addPuzzle = useCallback(() => {
    setPuzzles([...puzzles, {
      puzzleText: '',
      hints: ['', ''],
      location: null,
      photoReq: false,
    }]);
  }, [puzzles]);

  const updatePuzzle = useCallback((index: number, field: keyof Puzzle, value: any) => {
    setPuzzles((prevPuzzles) => {
      const updatedPuzzles = [...prevPuzzles];
      updatedPuzzles[index] = { ...updatedPuzzles[index], [field]: value };
      return updatedPuzzles;
    });
  }, []);

  const updateHint = useCallback((puzzleIndex: number, hintIndex: number, value: string) => {
    setPuzzles((prevPuzzles) => {
      const updatedPuzzles = [...prevPuzzles];
      updatedPuzzles[puzzleIndex].hints[hintIndex] = value;
      return updatedPuzzles;
    });
  }, []);

  // Handle location update from the map
  const handleLocationSelect = useCallback((puzzleIndex: number, location: { coordinates: [number, number]; popupText?: string }) => {
    updatePuzzle(puzzleIndex, 'location', location);
  }, [updatePuzzle]);


  const boundsConstraint = {
    north: 25.496979684903667,
    south: 25.489079078157516,
    east:  81.86999098996981,
    west:  81.86005752776079
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
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-background/50 border-emerald-500/20"
            required
          />
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-background/50 border-emerald-500/20"
            required
          />
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
            <div className="bg-white-700 mx-auto my-5 w-[100%] h-[20%]">
              <Map
                posix={[25.493620009925067, 81.8628369732815]} // Default position
                bounds={boundsConstraint}
                onLocationSelect={(coordinates) => handleLocationSelect(puzzleIndex, coordinates)} // Pass the index and coordinates
                customLocations={customLocations}
              />
            </div>
            {puzzle.location && puzzle.location.coordinates && (
  <p className="text-sm text-emerald-400">
    Selected: {puzzle.location.coordinates[0].toFixed(4)}, {puzzle.location.coordinates[1].toFixed(4)}
    {puzzle.location.popupText && (
      <span> - {puzzle.location.popupText}</span>
    )}
  </p>
)}
            <div className="flex items-center">
              <span className="text-sm text-emerald-400 mr-2">Image Required</span>
              <Switch
                checked={puzzle.photoReq}
                onCheckedChange={(checked) => updatePuzzle(puzzleIndex, 'photoReq', checked)}
                className="bg-background/50 border-emerald-500/20"
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" className="w-full border-emerald-500/20" onClick={addPuzzle}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Puzzle
        </Button>

        <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500">
          Create Hunt
        </Button>
      </form>
    </div>
  );
}