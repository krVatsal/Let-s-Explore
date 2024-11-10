"use client"
import { useState, useEffect,useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MapPin, Trophy, Upload, Clock, Users, Lock, Unlock, CheckCircle2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleProgress } from "@/components/puzzle/PuzzleProgress";
import { PuzzleHints } from "@/components/puzzle/PuzzleHints";
import { LocationSharing } from "@/components/puzzle/LocationSharing";
import { useHunt } from "../context/huntContext";
import { interval } from "date-fns";
import { AuthContext } from "../context/AuthContext";
const formSchema = z.object({
  location: z.array(z.number()).length(2).nullable(),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;
type LeaderboardEntry = {
  userId: string;
  name: string;
  score: number;
  solvedPuzzles: number;
  timeTaken: string;
  rank?: number;
};


export default function PuzzlePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [huntStartTime, setHuntStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [hintsOpened, setHintsOpened] = useState(0);
  const [submissionIntervals, setSubmissionIntervals] = useState<number[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [isLeaderboardUpdated, setIsLeaderboardUpdated] = useState(false); 
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available.");
  }
  
  const { user } = authContext;
  const { participationData } = useHunt();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: null,
      photo: undefined
    }
  });

console.log(participationData)

useEffect(() => {
  // Set huntStartTime when the puzzle starts or changes
  const startTime = Date.now();
  setHuntStartTime(startTime);

  // Reset elapsed time for the new puzzle
  setElapsedTime(0);

  return () => {
    // Optional cleanup logic if required when the component unmounts or puzzle changes
  };
}, [currentPuzzle]);

// Calculate elapsed time
useEffect(() => {
  if (!huntStartTime) return;

  const timer = setInterval(() => {
    setElapsedTime(Math.floor((Date.now() - huntStartTime) / 1000)); // Update elapsed time in seconds
  }, 1000);

  return () => clearInterval(timer); // Clear timer on unmount
}, [huntStartTime]);

const endTime = participationData.data.puzzles.endTime
function calculateTimeRemaining(endTime) {
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const timeLeft = end - now;

  if (timeLeft <= 0) {
    return "Time's up!";
  }

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s remaining`;
}
const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(endTime));
useEffect(() => {
  const interval = setInterval(() => {
    setTimeRemaining(calculateTimeRemaining(endTime));
  }, 1000);

  return () => clearInterval(interval); // Cleanup on component unmount
}, [endTime]);

const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

// Callback for LocationSharing
const handleLocationChange = (coords: [number, number]) => {
  setCurrentLocation(coords);
};


const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setPhoto(file);
    toast({
      title: "Photo Selected",
      description: `Selected file: ${file.name}`,
    });
  }
};

async function onSubmit(values: FormData) {
  setIsSubmitting(true);

  if (!user?._id || !participationData?.data?.huntId ) {
    toast({
      title: "Error",
      description: "Missing user, hunt, or location information",
      variant: "destructive",
    });
    setIsSubmitting(false);
    return;
  }

  const currentTime = Date.now();
  const timeTaken = huntStartTime ? Math.floor((currentTime - huntStartTime) / 1000) : 0;

  try {
    const formData = new FormData();

    // Add all required fields
    formData.append("huntId", participationData.data.huntId);
    formData.append("userId", user._id);
    formData.append("puzzleId", participationData.data.puzzles.puzzles[currentPuzzle]._id);
    formData.append("guessedLocation", JSON.stringify({ coordinates: currentLocation }));
    formData.append("timeTaken", timeTaken.toString());
    formData.append("hintsOpened", hintsOpened.toString());

    // Add photo if exists
    if (participationData.data.puzzles.puzzles[currentPuzzle].photoReq && photo) {
      formData.append("image", photo);
    }

    console.log("Submitting form data:", Object.fromEntries(formData.entries()));

    const response = await fetch("http://localhost:5217/api/v1/submitGuess", {
      method: "PUT",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit answer");
    }

    console.log("Submission result:", result);

    toast({
      title: "Success!",
      description: `Answer submitted successfully! Score: ${result.score}`,
    });

    // Move to next puzzle if submission was successful
    if (currentPuzzle < participationData.data.puzzles.puzzles.length - 1) {
      setCurrentPuzzle((prev) => prev + 1);
    }

    // Reset form and photo
    form.reset();
    setPhoto(null);
    setHintsOpened(0);

    // Fetch updated leaderboard immediately after successful submission
    await fetchLeaderboard();

  } catch (error) {
    console.error("Submission error:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to submit answer",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
}

// Modify your fetchLeaderboard function to include better error handling:
type LeaderboardApiResponse = {
  data: {
    leaderboard: Array<{
      email: string;
      hintsUsed: number;
      lastAttempt: string;
      points: number;
      puzzlesSolved: number;
      rank: number;
      userName: string;
    }>;
  };
  message: string;
  statusCode: number;
  success: boolean;
};

// Update the LeaderboardEntry type to match our transformed data
type LeaderboardEntry = {
  userId: string;
  name: string;
  score: number;
  solvedPuzzles: number;
  timeTaken: string;
  rank: number;
};

// Update the fetchLeaderboard function
const fetchLeaderboard = async () => {
  setIsLeaderboardLoading(true);
  try {
    console.log("Fetching leaderboard for hunt:", participationData.data.huntId);
    
    const response = await fetch(
      `http://localhost:5217/api/v1/leaderboard/${participationData.data.huntId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch leaderboard");
    }
    
    const responseData: LeaderboardApiResponse = await response.json();
    console.log("Leaderboard data received:", responseData);
    
    if (!responseData.success || !responseData.data.leaderboard) {
      throw new Error("Invalid leaderboard data received");
    }
    
    // Transform the API response data into the required format
    const processedData: LeaderboardEntry[] = responseData.data.leaderboard.map((entry) => {
      // Calculate time taken since last attempt
      const lastAttemptDate = new Date(entry.lastAttempt);
      const now = new Date();
      const timeDiff = Math.floor((now.getTime() - lastAttemptDate.getTime()) / 1000); // in seconds
      
      // Format time taken
      const formatTimeTaken = (seconds: number): string => {
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
      };

      return {
        userId: entry.email, // Using email as userId since it's unique
        name: entry.userName,
        score: entry.points,
        solvedPuzzles: entry.puzzlesSolved,
        timeTaken: formatTimeTaken(timeDiff),
        rank: entry.rank
      };
    });
    
    setLeaderboard(processedData);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to load leaderboard data",
      variant: "destructive",
    });
  } finally {
    setIsLeaderboardLoading(false);
  }
};


  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 text-center space-y-4 max-w-md mx-auto">
          <div className="text-red-500">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold">Error Loading Puzzle</h2>
          <p className="text-gray-400">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (participationData?.data?.huntId) {
      fetchLeaderboard();
    }
  }, [participationData?.data?.huntId]);
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=2000&h=1000&blur=50')] mix-blend-overlay opacity-5 bg-cover bg-center" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
              {participationData.data.puzzles.name}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {participationData.data.puzzles.description}
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span>{timeRemaining}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>{participationData.data.participantsCount} hunters active</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <PuzzleProgress currentPuzzle={currentPuzzle+1} totalPuzzles={participationData.data.puzzles.puzzles.length} />

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Puzzle Section */}
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card p-6">
                <Tabs defaultValue="riddle" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="riddle">Riddle</TabsTrigger>
                    <TabsTrigger value="hints">Hints</TabsTrigger>
                  </TabsList>
                  <TabsContent value="riddle" className="space-y-4">
                    <div className="prose prose-emerald dark:prose-invert max-w-none">
                      <p className="text-lg font-medium text-center italic">
                        {participationData.data.puzzles.puzzles[currentPuzzle].puzzleText}
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Instructions:</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Find the location described in the riddle</li>
                        <li>Share your current location</li>
                        <li>Submit a selfie of yours at the location (optional)</li>
                        <li>50 points will be awarded for each correct submission</li>
                        <li>30 points will be awarded for each correct image submission</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="hints">
                  <PuzzleHints onHintsChange={setHintsOpened} hintsData={participationData.data.puzzles.puzzles[currentPuzzle].hints} />
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Location Sharing Section */}
              <Card className="glass-card p-6">
              <LocationSharing onLocationChange={handleLocationChange} />
              </Card>
              <Card className="glass-card p-6">
              <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <input
              type="hidden"
              {...field}
              value={currentLocation ? JSON.stringify(currentLocation) : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    
    {participationData.data.puzzles.puzzles[currentPuzzle].photoReq && (
      <FormField
        control={form.control}
        name="photo"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-emerald-500/20"
                  onClick={() => document.getElementById("photo-input")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*"
                  onChange={(e) => {
                    handlePhotoUpload(e);
                    field.onChange(e.target.files?.[0]);
                  }}
                  style={{ display: "none" }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )}

    <Button
      type="submit"
      className={cn(
        "w-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500",
        isSubmitting && "animate-pulse"
      )}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Verifying..." : "Submit Answer"}
    </Button>
  </form>
</Form>
    </Card>

            </div>

            {/* Leaderboard Section */}
            <Card className="glass-card p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-500" />
          Leaderboard
        </h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchLeaderboard}
          disabled={isLeaderboardLoading}
        >
          {isLeaderboardLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
              Updating...
            </span>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            No leaderboard data available
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                entry.rank === 1 && "bg-emerald-500/10 border border-emerald-500/20",
                user?._id === entry.userId && "bg-sky-500/10 border border-sky-500/20"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                  entry.rank === 1 && "bg-emerald-500 text-white",
                  user?._id === entry.userId && "bg-sky-500 text-white"
                )}>
                  {entry.rank}
                </span>
                <div>
                  <p className="font-medium">
                    {entry.name}
                    {user?._id === entry.userId && " (You)"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {entry.solvedPuzzles} puzzles • {entry.timeTaken}
                  </p>
                </div>
              </div>
              <span className="font-bold">{entry.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  </Card>
          </div>
        </div>
      </div>
    </div>
  );
}