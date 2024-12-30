import React from "react";
import { useReadThaiGameState } from "../hooks/useReadThaiGameState";
import GameHeader from "../components/GameHeader";

interface DebugSection {
  title: string;
  data: unknown;
}

interface ActionButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const DebugPage: React.FC = () => {
  const gameState = useReadThaiGameState();

  const renderSection = ({ title, data }: DebugSection) => (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
      <pre className="bg-gray-900 p-4 rounded overflow-auto text-white whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );

  const renderActionButton = ({
    label,
    onClick,
    disabled = false,
  }: ActionButton) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg ${
        disabled
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {label}
    </button>
  );

  const actionButtons: ActionButton[] = [
    {
      label: "Load First Lesson",
      onClick: () => gameState.setCurrentLesson(0),
      disabled: gameState.currentLesson === 0,
    },
    {
      label: "First Pass Mode",
      onClick: () => gameState.setProgressionMode("firstPass"),
      disabled: gameState.progressionMode === "firstPass",
    },
    {
      label: "Practice Mode",
      onClick: () => gameState.setProgressionMode("spacedRepetition"),
      disabled: gameState.progressionMode === "spacedRepetition",
    },
    {
      label: "Test Mode",
      onClick: () => gameState.setProgressionMode("test"),
      disabled: gameState.progressionMode === "test",
    },
    {
      label: "Next Item",
      onClick: () => gameState.nextItem(),
      disabled: !gameState.activeVocabItem,
    },
    {
      label: "Mark for Practice",
      onClick: () => {
        if (gameState.activeVocabItem) {
          gameState.handleFirstPassChoice(
            gameState.activeVocabItem.id,
            "practice"
          );
        }
      },
      disabled: !gameState.activeVocabItem,
    },
    {
      label: "Mark as Mastered",
      onClick: () => {
        if (gameState.activeVocabItem) {
          gameState.handleFirstPassChoice(
            gameState.activeVocabItem.id,
            "mastered"
          );
        }
      },
      disabled: !gameState.activeVocabItem,
    },
    {
      label: "Skip Item",
      onClick: () => {
        if (gameState.activeVocabItem) {
          gameState.handleFirstPassChoice(
            gameState.activeVocabItem.id,
            "skipped"
          );
        }
      },
      disabled: !gameState.activeVocabItem,
    },
    {
      label: "Clear Local Storage",
      onClick: () => {
        localStorage.clear();
        window.location.reload();
      },
    },
  ];

  const sections: DebugSection[] = [
    {
      title: "Actions",
      data: null,
    },
    {
      title: "Lesson State",
      data: {
        currentLesson: gameState.currentLesson,
        progressionMode: gameState.progressionMode,
        totalLessons: gameState.totalLessons,
      },
    },
    {
      title: "Working Set",
      data: {
        workingSet: gameState.workingSet,
        activeVocabItem: gameState.activeVocabItem,
        currentItem: gameState.currentItem,
      },
    },
    {
      title: "Lesson Subset",
      data: gameState.lessonSubset,
    },
    {
      title: "Game State",
      data: gameState.gameState,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <GameHeader title="Debug View" darkMode={true} />

      <div className="max-w-4xl mx-auto text-xs">
        {sections.map((section, index) => (
          <div key={index}>
            {section.title === "Actions" ? (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4 text-white">
                  {section.title}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {actionButtons.map((button, i) => (
                    <div key={i}>{renderActionButton(button)}</div>
                  ))}
                </div>
              </div>
            ) : (
              renderSection(section)
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPage;
