import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Globe, Tag } from "lucide-react";
import { Lesson } from "@/types/lessons";
import ModalContainer from "../ui/ModalContainer";
import FlashCard from "./FlashCard";
import DifficultyLevel from "./DifficultyLevel";
import ModalCTAButton from "../ui/ModalCTAButton";
interface LessonDetailsProps {
  lesson: Lesson;
  onClose: () => void;
  onStudyLesson: (index: number) => void;
  lessonIndex: number;
}

const LessonDetails = ({
  lesson,
  onClose,
  onStudyLesson,
  lessonIndex,
}: LessonDetailsProps) => {
  const [currentFlashCard, setCurrentFlashCard] = useState(null);

  const studyButton = ModalCTAButton({
    onClick: () => {
      onStudyLesson(lessonIndex);
      onClose();
    },
    label: "Study This Lesson",
  });

  return (
    <ModalContainer
      title="Lesson Details"
      onClose={onClose}
      className="max-w-4xl"
      bottomButtons={studyButton}
    >
      <ScrollArea className="h-full">
        <Card className="bg-gray-900 border-gray-800 mx-2 sm:mx-4">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant="outline"
                className="text-slate-300 border-slate-600"
              >
                {lesson.lessonLevel}
              </Badge>
              <DifficultyLevel difficulty={lesson.difficulty} />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-50">
              {lesson.lessonName}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {lesson.lessonDescription}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-400">Target Language</p>
                  <p className="text-slate-50">
                    {lesson.languagePair?.target?.name} (
                    {lesson.languagePair?.target?.nativeName})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-400">Lesson Type</p>
                  <p className="text-slate-50 capitalize">
                    {lesson.lessonType}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-400">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {lesson.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-800 text-slate-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-medium text-slate-200">
                  Vocabulary List
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lesson.items?.map((item) => (
                    <FlashCard
                      key={item.id}
                      current={item}
                      isVisible={true} // Always visible in this context
                      onSpeak={() => {}}
                      className="p-2 sm:p-3 xs:p-2"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </ScrollArea>

      {currentFlashCard && (
        <FlashCard
          current={currentFlashCard}
          isVisible={true}
          onSpeak={() => {}}
        />
      )}
    </ModalContainer>
  );
};

export default LessonDetails;
