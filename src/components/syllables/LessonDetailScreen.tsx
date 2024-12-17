import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Globe, BarChart3, Tag } from "lucide-react";
import { Lesson } from "@/types/lessons";

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
  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: "bg-green-500",
      2: "bg-blue-500",
      3: "bg-yellow-500",
      4: "bg-orange-500",
      5: "bg-red-500",
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-4xl w-full h-[90vh] relative">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-600 pb-3 flex justify-between items-center">
          Lesson Details
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-base"
          >
            Close
          </button>
        </h2>

        <div className="h-[calc(100%-138px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="outline"
                  className="text-slate-300 border-slate-600"
                >
                  {lesson?.lessonLevel}
                </Badge>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < lesson?.difficulty
                          ? getDifficultyColor(lesson?.difficulty)
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-50">
                {lesson?.lessonName}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {lesson?.lessonDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Target Language</p>
                    <p className="text-slate-50">
                      {lesson?.languagePair?.target?.name} (
                      {lesson?.languagePair?.target?.nativeName})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Lesson Type</p>
                    <p className="text-slate-50 capitalize">
                      {lesson?.lessonType}
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
                  {lesson?.tags?.map((tag) => (
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

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-400">
                    Vocabulary Items
                  </h3>
                </div>
                <ScrollArea className="h-96 rounded-md border border-slate-800">
                  <div className="p-4 space-y-6">
                    {lesson?.items?.map((item) => (
                      <Card
                        key={item.id}
                        className="bg-slate-800 border-slate-700"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xl font-medium text-slate-50">
                                {item.text}
                              </p>
                              <p className="text-sm text-slate-400">
                                {item.romanization}
                              </p>
                              <p className="text-slate-300">
                                {item.translation}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              {item?.tags?.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-slate-300 border-slate-600"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {item?.examples?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                              {item?.examples?.map((example, index) => (
                                <div key={index} className="text-sm">
                                  <p className="text-slate-50">
                                    {example?.text}
                                  </p>
                                  <p className="text-slate-400">
                                    {example?.romanization}
                                  </p>
                                  <p className="text-slate-300">
                                    {example?.translation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
          <button
            onClick={() => {
              onStudyLesson(lessonIndex);
              onClose();
            }}
            className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold
                     transition-colors duration-200 hover:bg-green-700
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Study This Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
