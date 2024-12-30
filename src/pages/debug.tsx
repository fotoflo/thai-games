import React, { useEffect } from "react";
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
      label: "Reset Lesson",
      onClick: () => {
        // Just reset to first lesson and first pass mode
        gameState.setCurrentLesson(0);
        gameState.setProgressionMode("firstPass");
      },
      disabled: false,
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
      disabled: !gameState.activeItem,
    },
    {
      label: "Mark for Practice",
      onClick: () => {
        if (gameState.activeItem) {
          gameState.handleFirstPassChoice(gameState.activeItem.id, "practice");
        }
      },
      disabled: !gameState.activeItem,
    },
    {
      label: "Mark as Mastered",
      onClick: () => {
        if (gameState.activeItem) {
          gameState.handleFirstPassChoice(gameState.activeItem.id, "mastered");
        }
      },
      disabled: !gameState.activeItem,
    },
    {
      label: "Skip Item",
      onClick: () => {
        if (gameState.activeItem) {
          gameState.handleFirstPassChoice(gameState.activeItem.id, "skipped");
        }
      },
      disabled: !gameState.activeItem,
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
      title: "Active Item",
      data: {
        activeItemId: gameState.activeItem,
      },
    },
    {
      title: "Lesson State",
      data: {
        currentLesson: gameState.currentLesson,
        lesson: gameState?.lessons[gameState.currentLesson]?.name,
        progressionMode: gameState.progressionMode,
        totalLessons: gameState.totalLessons,
        lessonItems: gameState?.lessons[gameState.currentLesson]?.items.map(
          (item) => item.id
        ),
      },
    },
    {
      title: "Working Set",
      data: {
        workingSetEntries: gameState.workingSet.map((entry) => entry.id),
        workingSetLength: gameState.workingSet.length,
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
