import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Plus } from "lucide-react";
import { levels } from "../data/constants";
import { Level, LevelSelectionProps } from "../types";

const LevelSelection: React.FC<LevelSelectionProps> = ({
  onSelect,
  selectedLevel,
}) => {
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [newLevel, setNewLevel] = useState("");

  const handleCreateLevel = () => {
    if (newLevel) {
      const level: Level = {
        id: newLevel.toUpperCase(),
        name: newLevel,
      };
      onSelect(level);
      setIsCreatingLevel(false);
      setNewLevel("");
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-lg font-medium">Choose Level</h2>
        </div>

        {isCreatingLevel ? (
          <div className="space-y-2">
            <Input
              autoFocus
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              placeholder="Enter level name..."
              className="bg-gray-800 border-gray-700 text-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateLevel();
                } else if (e.key === "Escape") {
                  setIsCreatingLevel(false);
                }
              }}
            />
            <p className="text-sm text-gray-400">
              Press Enter to confirm or Escape to cancel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {levels.map((level) => (
              <Button
                key={level.id}
                onClick={() => onSelect(level)}
                variant="outline"
                className={`border-gray-700 hover:bg-gray-800 text-gray-100 ${
                  selectedLevel?.id === level.id ? "bg-gray-800" : ""
                }`}
              >
                {level.name}
              </Button>
            ))}
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-100"
              onClick={() => {
                setIsCreatingLevel(true);
                setNewLevel("");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Level
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LevelSelection;
