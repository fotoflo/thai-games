import React from "react";
import GameHeader from "../components/GameHeader";
import { ReadThaiGameContext } from "@/machines/cardSetMachine";
import { useLessons } from "@/hooks/game/useLessons";
import FlashCardModal from "@/components/syllables/FlashCardModal";
import SuperSetVisualizer from "@/components/syllables/SuperSetVisualizer";
import ItemDisplay from "@/components/syllables/ItemDisplay";
import PracticeSetCards from "@/components/syllables/PracticeSetCards";
import { modals } from "@/hooks/useModal";
import {
  useSuperSet,
  useActiveItem,
  useGameMode,
  usePracticeSet,
  useGameLessons,
  useGameActions,
} from "@/hooks/game/useReadThaiGame";
import LessonListModal from "@/components/LessonListModal";
import LessonDetailsModal from "@/components/LessonDetailsModal";

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
  const snapshot = ReadThaiGameContext.useSelector(({ context }) => context);
  const { superSet, superSetIndex } = useSuperSet();
  const { practiceSet, practiceSetIndex } = usePracticeSet();
  const { activeItem } = useActiveItem();
  const { progressionMode } = useGameMode();
  const { lessons: apiLessons, lessonsLoading, lessonsError } = useLessons();
  const { sendReadThaiGameContext } = useGameLessons();
  const {
    nextItem,
    markForPractice,
    markAsMastered,
    skipItem,
    switchToPractice,
    switchToFirstPass,
  } = useGameActions();

  // TODO FINISH passing lessons from useLessons to cardSetMachine
  // utilise them instead of the llessons from the invoke
  if (!lessonsLoading && !lessonsError) {
    console.log("lessons111", apiLessons);
    sendReadThaiGameContext({ type: "INITIALIZE", lessons: apiLessons });
  }

  const buttonGroups: ButtonGroup[] = [
    {
      title: "Item Actions",
      buttons: [
        {
          label: "Next Item",
          onClick: nextItem,
          disabled: !activeItem,
        },
        {
          label: "Mark for Practice",
          onClick: markForPractice,
          disabled: !activeItem,
        },
        {
          label: "Mark as Mastered",
          onClick: markAsMastered,
          disabled: !activeItem,
        },
        {
          label: "Skip Item",
          onClick: skipItem,
          disabled: !activeItem,
        },
      ],
    },
    {
      title: "modals",
      buttons: [
        {
          label: "Open Flash Card Modal",
          onClick: () => activeItem && modals.flashCard.open({ activeItem }),
        },
        {
          label: "Open Lesson List",
          onClick: () => modals.lessonList.open(),
        },
      ],
    },
    {
      title: "Mode Selection",
      buttons: [
        {
          label: "First Pass Mode",
          onClick: switchToFirstPass,
          disabled: progressionMode === "firstPass",
        },
        {
          label: "Practice Mode",
          onClick: switchToPractice,
          disabled: progressionMode === "practice",
        },
      ],
    },
    {
      title: "Lesson Control",
      buttons: [
        {
          label: "Reset Lesson",
          onClick: () => {
            // TODO: Add setCurrentLesson to actions
            switchToFirstPass();
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

  const sections: DebugSection[] = [
    {
      title: `Active Item (simplified) - ${superSetIndex}`,
      data: {
        id: activeItem?.id,
        thai: activeItem?.item.sides[0].markdown,
        english: activeItem?.item.sides[1].markdown,
        tags: activeItem?.item.tags,
        recallCategory: activeItem?.recallCategory,
      },
      priority: 2,
    },
    {
      title: "Active Item Index",
      data: {
        superSetIndex,
        practiceSetIndex,
      },
      priority: 1,
    },
    {
      title: "SuperSet (simplified)",
      data: {
        length: superSet?.length,
        items: superSet?.map((entry) => ({
          id: entry.id,
          recallCategory: entry.recallCategory,
        })),
      },
      priority: 1,
    },
    {
      title: "Lesson State",
      data: {
        lessonCount: apiLessons.length || "null",
        currentLesson: snapshot.currentLesson,
        lesson: apiLessons?.[snapshot.currentLesson]?.name,
        progressionMode,
        lessonItems: apiLessons?.[snapshot.currentLesson]?.items?.map(
          (item) => item.id
        ),
      },
      priority: 2,
    },
    {
      title: "Active Items",
      data: activeItem,
      priority: 3,
    },
    {
      title: "Working Set",
      data: superSet,
      priority: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <FlashCardModal />
      <LessonListModal />
      <LessonDetailsModal />

      <GameHeader title="Debug View" darkMode={true} />

      <span className="text-white">Current Mode: {progressionMode}</span>
      <span className="text-white">Current State: {progressionMode}</span>

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

        <SuperSetVisualizer className="mb-5" />

        <ItemDisplay
          iconSize={52}
          textSize="text-6xl"
          className="flex items-center justify-center mb-10"
          speakOnUnmount={false}
          invertCard={false}
        />

        <PracticeSetCards className="border-y-2 border-slate-700 my-2" />

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
