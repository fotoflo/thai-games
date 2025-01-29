import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { CardPreviewProps } from "../types";

const CardPreview: React.FC<CardPreviewProps> = ({
  subject,
  level,
  topic,
  previewItems,
  onRegenerate,
  onApproveCard,
  onRejectCard,
  onCustomize,
  onCreateLesson,
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-100">
            <span className="text-2xl">{subject.icon}</span>
            <h2 className="text-lg font-medium">
              {topic.name} - {level.name}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 hover:bg-gray-800 text-gray-100"
            onClick={onRegenerate}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>

        <div className="space-y-3">
          {previewItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-lg text-gray-100">
                    {item.sides[0].markdown}
                  </div>
                  {item.sides[0].metadata?.pronunciation && (
                    <div className="text-sm text-gray-400">
                      {item.sides[0].metadata.pronunciation}
                    </div>
                  )}
                  <div className="text-base text-gray-300">
                    {item.sides[1].markdown}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                    onClick={() => onApproveCard(idx)}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => onRejectCard(idx)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 text-gray-100"
            onClick={onCustomize}
          >
            Customize
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onCreateLesson}
          >
            Create Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPreview;
