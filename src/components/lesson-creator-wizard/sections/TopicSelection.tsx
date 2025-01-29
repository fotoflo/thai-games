import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Plus } from "lucide-react";
import { popularTopics } from "../data/constants";
import { Topic, TopicSelectionProps } from "../types";

const TopicSelection: React.FC<TopicSelectionProps> = ({
  onSelect,
  selectedTopic,
}) => {
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const handleCreateTopic = () => {
    if (newTopic) {
      const topic: Topic = {
        id: newTopic.toLowerCase(),
        name: newTopic,
        icon: "📝",
      };
      onSelect(topic);
      setIsCreatingTopic(false);
      setNewTopic("");
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <Book className="h-5 w-5" />
          <h2 className="text-lg font-medium">Choose Topic</h2>
        </div>

        {isCreatingTopic ? (
          <div className="space-y-2">
            <Input
              autoFocus
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter topic name..."
              className="bg-gray-800 border-gray-700 text-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateTopic();
                } else if (e.key === "Escape") {
                  setIsCreatingTopic(false);
                }
              }}
            />
            <p className="text-sm text-gray-400">
              Press Enter to confirm or Escape to cancel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {popularTopics.map((topic) => (
              <Button
                key={topic.id}
                onClick={() => onSelect(topic)}
                variant="outline"
                className={`justify-start text-lg border-gray-700 hover:bg-gray-800 text-gray-100 ${
                  selectedTopic?.id === topic.id ? "bg-gray-800" : ""
                }`}
              >
                <span className="mr-2 text-2xl">{topic.icon}</span>
                {topic.name}
              </Button>
            ))}
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-100"
              onClick={() => {
                setIsCreatingTopic(true);
                setNewTopic("");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicSelection;
