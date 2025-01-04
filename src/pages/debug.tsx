import React from "react";
import { useReadThaiGameState } from "../hooks/useReadThaiGameState";
import GameHeader from "../components/GameHeader";
import PracticeSetVisualizer from "@/components/syllables/PracticeSetVisualizer";

interface DebugSection {
  title: string;
  data: unknown;
  priority?: number; // Higher number = wider/taller
}

interface ActionButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ButtonGroup {
  title: string;
  buttons: ActionButton[];
}

const DebugPage: React.FC = () => {
  const gameState = useReadThaiGameState();

  const renderSection = ({ title, data }: DebugSection) => (
    <div className="bg-gray-800 rounded-lg p-4 w-full break-inside-avoid mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
      <pre className="bg-gray-900 p-4 rounded overflow-auto text-white whitespace-pre-wrap break-words text-xs">
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
      className={`px-4 py-2 rounded-lg w-full ${
        disabled
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {label}
    </button>
  );

  const buttonGroups: ButtonGroup[] = [
    {
      title: "Item Actions",
      buttons: [
        {
          label: "Next Item",
          onClick: gameState.nextItem,
          disabled: !gameState.activeItem,
        },
        {
          label: "Mark for Practice",
          onClick: gameState.handleMarkForPractice,
          disabled: !gameState.activeItem,
        },
        {
          label: "Mark as Mastered",
          onClick: gameState.handleMarkAsMastered,
          disabled: !gameState.activeItem,
        },
        {
          label: "Skip Item",
          onClick: gameState.handleSkipItem,
          disabled: !gameState.activeItem,
        },
      ],
    },
    {
      title: "Mode Selection",
      buttons: [
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
      ],
    },
    {
      title: "Lesson Control",
      buttons: [
        {
          label: "Reset Lesson",
          onClick: () => {
            gameState.setCurrentLesson(0);
            gameState.setProgressionMode("firstPass");
          },
          disabled: false,
        },
        {
          label: "Clear Local Storage",
          onClick: () => {
            localStorage.clear();
            window.location.reload();
          },
        },
      ],
    },
  ];

  const sections: DebugSection[] = [
    {
      title: "Active Item (simplified)",
      data: {
        id: gameState.activeItem?.id,
        thai: gameState.activeItem?.item.sides[0].markdown,
        english: gameState.activeItem?.item.sides[1].markdown,
        tags: gameState.activeItem?.item.tags,
      },
      priority: 2,
    },
    {
      title: "Working Set (simplified)",
      data: {
        length: gameState.practiceSet.length,
        items: gameState.practiceSet.map((entry) => ({
          id: entry.id,
          recallCategory: entry.item.recallCategory,
        })),
      },
      priority: 1,
    },
    {
      title: "Lesson State",
      data: {
        currentLesson: gameState.currentLesson,
        lesson: gameState?.lessons[gameState.currentLesson]?.name,
        progressionMode: gameState.progressionMode,
        lessonItems: gameState?.lessons[gameState.currentLesson]?.items.map(
          (item) => item.id
        ),
      },
      priority: 2,
    },
    {
      title: "Active Item",
      data: gameState.activeItem,
      priority: 3,
    },
    {
      title: "Lesson Subset",
      data: gameState.lessonSubset,
      priority: 2,
    },
    {
      title: "Game State",
      data: gameState.gameState,
      priority: 2,
    },
    {
      title: "Working Set",
      data: gameState.practiceSet,
      priority: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <GameHeader title="Debug View" darkMode={true} />

      <div className="max-w-7xl mx-auto">
        {/* Actions Section */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-4 text-white">Actions</h2>
          <div className="space-y-4">
            {buttonGroups.map((group, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-md font-semibold text-gray-300">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {group.buttons.map((button, j) => (
                    <div key={j}>{renderActionButton(button)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <PracticeSetVisualizer
          practiceSet={gameState.practiceSet}
          className="mb-4"
        />
        {/* State Views Section - Masonry Layout */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {sections
            .filter((section) => section.title !== "Actions")
            .map((section, index) => (
              <div
                key={index}
                className={`break-inside-avoid-column ${
                  section.priority === 3 ? "w-full" : ""
                }`}
              >
                {renderSection(section)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
