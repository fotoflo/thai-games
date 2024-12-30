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

interface ButtonGroup {
  title: string;
  buttons: ActionButton[];
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

  const buttonGroups: ButtonGroup[] = [
    {
      title: "Item Actions",
      buttons: [
        {
          label: "Next Item",
          onClick: () => gameState.nextItem(),
          disabled: !gameState.activeItem,
        },
        {
          label: "Mark for Practice",
          onClick: () => {
            if (gameState.activeItem) {
              gameState.handleFirstPassChoice(
                gameState.activeItem.id,
                "practice"
              );
            }
          },
          disabled: !gameState.activeItem,
        },
        {
          label: "Mark as Mastered",
          onClick: () => {
            if (gameState.activeItem) {
              gameState.handleFirstPassChoice(
                gameState.activeItem.id,
                "mastered"
              );
            }
          },
          disabled: !gameState.activeItem,
        },
        {
          label: "Skip Item",
          onClick: () => {
            if (gameState.activeItem) {
              gameState.handleFirstPassChoice(
                gameState.activeItem.id,
                "skipped"
              );
            }
          },
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
      title: "Actions",
      data: null,
    },
    {
      title: "Active Item (simplified)",
      data: {
        thai: gameState.activeItem?.vocabularyItem.sides[0].markdown,
        english: gameState.activeItem?.vocabularyItem.sides[1].markdown,
        activeItemId: gameState.activeItem?.id,
        mastery: gameState.activeItem?.mastery,
        tags: gameState.activeItem?.vocabularyItem.tags,
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
    {
      title: "Active Item",
      data: gameState.activeItem,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <GameHeader title="Debug View" darkMode={true} />

      <div className="max-w-4xl mx-auto text-xs">
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

        {/* State Views Section - Pinterest-style layout */}
        <div className="grid grid-cols-2 gap-4 auto-rows-auto grid-flow-dense">
          {sections
            .filter((section) => section.title !== "Actions")
            .map((section, index) => (
              <div
                key={index}
                className={`${
                  section.title === "Active Item" ||
                  section.title === "Lesson State"
                    ? "col-span-1 row-span-2"
                    : "col-span-1"
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
