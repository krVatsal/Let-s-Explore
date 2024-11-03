"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const HINTS = [
  {
    id: 1,
    text: "Look for a place where modern technology meets traditional learning.",
    cost: 25,
  },
  {
    id: 2,
    text: "Check near the central computing facility.",
    cost: 50,
  }
];

export function PuzzleHints() {
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const { toast } = useToast();

  const unlockHint = (hintId: number, cost: number) => {
    if (unlockedHints.includes(hintId)) return;

    toast({
      title: `Hint ${hintId} Unlocked!`,
      description: `-${cost} points`,
    });
    setUnlockedHints([...unlockedHints, hintId]);
  };

  return (
    <div className="space-y-4">
      {HINTS.map((hint, index) => {
        const isUnlocked = unlockedHints.includes(hint.id);
        const isPreviousUnlocked = index === 0 || unlockedHints.includes(HINTS[index - 1].id);

        return (
          <div
            key={hint.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300",
              isUnlocked
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-gray-500/20 bg-gray-500/5",
              !isPreviousUnlocked && "opacity-50"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {isUnlocked ? (
                  <Unlock className="w-5 h-5 text-emerald-500 animate-[unlock_0.5s_ease-in-out]" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium mb-1">Hint {hint.id}</h3>
                  {isUnlocked ? (
                    <p className="text-sm text-gray-400">{hint.text}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Unlock this hint for {hint.cost} points
                    </p>
                  )}
                </div>
              </div>
              {!isUnlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/20"
                  onClick={() => unlockHint(hint.id, hint.cost)}
                  disabled={!isPreviousUnlocked}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Unlock
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}