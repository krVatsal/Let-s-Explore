"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MapPin, Trophy, Upload, Clock, Users, Lock, Unlock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuzzleMap } from "@/components/puzzle/PuzzleMap";
import { PuzzleProgress } from "@/components/puzzle/PuzzleProgress";
import { PuzzleHints } from "@/components/puzzle/PuzzleHints";
import { PuzzleStatusCards } from "@/components/puzzle/PuzzleStatusCards";

const formSchema = z.object({
  answer: z.string().min(1, "Answer is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  solved: number;
  time: string;
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Alex Turner", score: 2500, solved: 5, time: "1h 23m" },
  { rank: 2, name: "Sarah Chen", score: 2300, solved: 4, time: "1h 45m" },
  { rank: 3, name: "Raj Patel", score: 2100, solved: 4, time: "2h 10m" },
];

const TOTAL_PUZZLES = 10;
const CURRENT_PUZZLE = 4;

export default function PuzzlePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please mark the location on the map",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Answer Submitted!",
        description: "Your answer is being verified.",
      });
      form.reset();
      setSelectedLocation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=2000&h=1000&blur=50')] mix-blend-overlay opacity-5 bg-cover bg-center" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">
              The Hidden Library
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Decode the ancient riddle and find the secret entrance to MNNIT's mystical library.
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span>30 minutes remaining</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>42 hunters active</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <PuzzleProgress currentPuzzle={CURRENT_PUZZLE} totalPuzzles={TOTAL_PUZZLES} />

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
                        "Where knowledge flows like a digital stream,<br/>
                        Ancient wisdom meets modern dream.<br/>
                        Between pillars three, a secret lies,<br/>
                        Where students rest their weary eyes."
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Instructions:</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Find the location described in the riddle</li>
                        <li>Mark the exact spot on the map</li>
                        <li>Submit a photo of the location (optional)</li>
                        <li>Enter the secret code found at the location</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="hints">
                    <PuzzleHints />
                  </TabsContent>
                </Tabs>
              </Card>

              <Card className="glass-card p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PuzzleMap
                      selectedLocation={selectedLocation}
                      onLocationSelect={setSelectedLocation}
                    />

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-emerald-500/20"
                        onClick={() => {
                          toast({
                            title: "Photo Upload",
                            description: "This feature will be available soon!",
                          });
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      
                      {/* <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter secret code..."
                                className="bg-gray-900/50 border-emerald-500/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                    </div>

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

              {/* Puzzle Status Cards */}
              <PuzzleStatusCards currentPuzzle={CURRENT_PUZZLE} totalPuzzles={TOTAL_PUZZLES} />
            </div>

            {/* Leaderboard Section */}
            <Card className="glass-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-500" />
                    Leaderboard
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => {
                    toast({
                      title: "Leaderboard Updated",
                      description: "Latest scores loaded!",
                    });
                  }}>
                    Refresh
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {MOCK_LEADERBOARD.map((entry) => (
                    <div
                      key={entry.rank}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        entry.rank === 1 && "bg-emerald-500/10 border border-emerald-500/20"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                          entry.rank === 1 && "bg-emerald-500 text-white"
                        )}>
                          {entry.rank}
                        </span>
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-sm text-gray-400">{entry.solved} puzzles • {entry.time}</p>
                        </div>
                      </div>
                      <span className="font-bold">{entry.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}