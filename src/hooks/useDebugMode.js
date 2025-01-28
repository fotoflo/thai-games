import { useState } from "react";

export const useDebugMode = (workingList, possibleProblemList, problemList) => {
  const [copied, setCopied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const copyDebugInfo = async () => {
    try {
      const debugInfo = `Working syllables: ${workingList.join(
        ", "
      )}\nPossibly problematic: ${possibleProblemList.join(
        ", "
      )}\nProblem syllables: ${problemList.join(", ")}`;
      await navigator.clipboard.writeText(debugInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  };

  return {
    copied,
    showDebug,
    setShowDebug,
    copyDebugInfo,
  };
};
