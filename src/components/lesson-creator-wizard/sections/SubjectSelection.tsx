import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Plus } from "lucide-react";
import { popularSubjects } from "../data/constants";
import { Subject, SubjectSelectionProps } from "../types";

const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  onSelect,
  selectedSubject,
}) => {
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const handleCreateSubject = () => {
    if (newSubject) {
      const subject: Subject = {
        id: newSubject.toLowerCase(),
        name: newSubject,
        icon: "📚",
      };
      onSelect(subject);
      setIsCreatingSubject(false);
      setNewSubject("");
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-100">
          <Book className="h-5 w-5" />
          <h2 className="text-lg font-medium">Choose Subject</h2>
        </div>

        {isCreatingSubject ? (
          <div className="space-y-2">
            <Input
              autoFocus
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Enter subject name..."
              className="bg-gray-800 border-gray-700 text-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateSubject();
                } else if (e.key === "Escape") {
                  setIsCreatingSubject(false);
                }
              }}
            />
            <p className="text-sm text-gray-400">
              Press Enter to confirm or Escape to cancel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {popularSubjects.map((subject) => (
              <Button
                key={subject.id}
                onClick={() => onSelect(subject)}
                variant="outline"
                className={`justify-start text-lg border-gray-700 hover:bg-gray-800 text-gray-100 ${
                  selectedSubject?.id === subject.id ? "bg-gray-800" : ""
                }`}
              >
                <span className="mr-2 text-2xl">{subject.icon}</span>
                {subject.name}
              </Button>
            ))}
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-100"
              onClick={() => {
                setIsCreatingSubject(true);
                setNewSubject("");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectSelection;
