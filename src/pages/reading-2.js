import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { thaiLessons } from "@/lessons/reading-2-vocab";

const Reading2Page = () => {
  const [currentCategory, setCurrentCategory] = useState("where");
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    if (window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const categories = Object.keys(thaiLessons.questions);
  const currentLessons = thaiLessons.questions[currentCategory];

  const speak = (text) => {
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "th-TH";
      synth.speak(utterance);
    }
  };

  const renderWord = (segment, isRomanized = false) => {
    const parts = isRomanized ? segment.romanized : segment.thai;
    return (
      <span
        className={`${segment.color} mx-1 group relative`}
        key={parts.join("-")}
      >
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && "-"}
            <span className="inline-block">{part}</span>
          </React.Fragment>
        ))}
        <span className="absolute -top-4 left-0 text-xs bg-gray-100 px-1 rounded opacity-0 group-hover:opacity-100">
          {segment.type}
        </span>
      </span>
    );
  };

  const renderLiteralChinese = (literal) => {
    return literal.text.map((word, idx) => (
      <span key={idx} className={`${literal.colors[idx]} mx-1`}>
        {word}
      </span>
    ));
  };

  const renderEnglishSegments = (segments) => {
    return segments.map((segment, idx) => (
      <span key={idx} className={`${segment.color} mx-1`}>
        {segment.english}
      </span>
    ));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Thai Language Learning</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={currentCategory === cat ? "default" : "outline"}
                onClick={() => {
                  setCurrentCategory(cat);
                  setCurrentIndex(0);
                  setShowTranslation(false);
                }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <p className="text-4xl">
                {currentLessons[currentIndex].segments.map((segment) =>
                  renderWord(segment)
                )}
                <span className="text-black mx-1">?</span>
              </p>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  speak(
                    currentLessons[currentIndex].segments
                      .map((s) => s.thai.join(""))
                      .join(" ") + "?"
                  )
                }
                className="rounded-full"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-2xl text-gray-600">
              {currentLessons[currentIndex].segments.map((segment) =>
                renderWord(segment, true)
              )}
              <span className="text-black mx-1">?</span>
            </p>
            <p className="text-2xl">
              {renderLiteralChinese(
                currentLessons[currentIndex].literal_chinese
              )}
              <span className="text-black mx-1">?</span>
            </p>
            <p className="text-2xl">
              {renderEnglishSegments(currentLessons[currentIndex].segments)}
              <span className="text-black mx-1">?</span>
            </p>
          </div>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </Button>

          {showTranslation && (
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-xl">
                  {currentLessons[currentIndex].english}
                </p>
                <p className="text-sm text-gray-500">
                  Natural Chinese:{" "}
                  {currentLessons[currentIndex].natural_chinese}
                </p>
              </div>

              <div className="rounded-lg bg-gray-100 p-4">
                <h3 className="font-bold mb-2">Key Vocabulary:</h3>
                <div className="space-y-3">
                  {currentLessons[currentIndex].segments.map((segment, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className={`${segment.color}`}>
                        <span className="font-medium">
                          {segment.thai.join("-")}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({segment.romanized.join("-")})
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{segment.english}</span>
                        <span>{segment.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold mb-2">Grammar Point:</h4>
                  <p>{currentLessons[currentIndex].grammar_point}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button
              variant="default"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            >
              Previous
            </Button>
            <Button
              variant="default"
              onClick={() =>
                setCurrentIndex(
                  Math.min(currentLessons.length - 1, currentIndex + 1)
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reading2Page;
