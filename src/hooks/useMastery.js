import { useState } from "react";
import { generateSyllable } from "../utils/syllableGenerator"; // Import the syllable generator

const useMastery = (initialWorkingSet, initialCurrent) => {
  const [workingSet, setWorkingSet] = useState(initialWorkingSet);
  const [current, setCurrent] = useState(initialCurrent);
  const [workingList, setWorkingList] = useState([]);

  const rateMastery = (rating) => {
    if (!current) return;

    const updated = workingSet.map((s) =>
      s.text === current.text ? { ...s, mastery: rating } : s
    );

    if (rating === 5) {
      const index = updated.findIndex((s) => s.text === current.text);
      updated[index] = generateSyllable(); // Generate a new syllable
    }

    setWorkingSet(updated);
    setCurrent(updated[Math.floor(Math.random() * updated.length)]);
  };

  return { workingSet, current, rateMastery, workingList };
};

export default useMastery;
