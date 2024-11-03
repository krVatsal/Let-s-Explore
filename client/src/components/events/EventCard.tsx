import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Puzzle, Radio } from "lucide-react"; // Use Puzzle icon
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Event = {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: number;
  totalPuzzles: number;
  difficulty: string;
  status: "live" | "upcoming";
};

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const isLive = event.status === "live";

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="glass-card overflow-hidden group hover:border-emerald-500/30 transition-colors">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getDifficultyColor(event.difficulty)} border`}>
                {event.difficulty}
              </Badge>
              {isLive && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(startDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/10">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>{event.participants} joined</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Puzzle className="w-4 h-4 text-emerald-500" /> {/* Use Puzzle icon here */}
              <span>{event.totalPuzzles} puzzles</span>
            </div>
          </div>
          
          <Button
            asChild
            className={cn(
              "transition-all duration-300",
              isLive
                ? "bg-red-600 hover:bg-red-500"
                : "bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500"
            )}
          >
            <Link href={isLive ? `/puzzle` : `/events/${event.id}/register`}>
              {isLive ? "Join Now" : "Register"}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
