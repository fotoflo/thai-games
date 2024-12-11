import { initialConsonants, vowels, finalConsonants } from "./thaiLanguage"; // Adjust the import path if necessary

export const generateSyllable = () => {
  const initial =
    initialConsonants[Math.floor(Math.random() * initialConsonants.length)];
  const vowel = vowels[Math.floor(Math.random() * vowels.length)];
  const final =
    finalConsonants[Math.floor(Math.random() * finalConsonants.length)];

  const needsFinal =
    vowel === "เ" || vowel === "แ" || vowel === "โ" || vowel === "ไ";
  const actualFinal = needsFinal
    ? finalConsonants.filter((f) => f !== "")[
        Math.floor(Math.random() * (finalConsonants.length - 1))
      ]
    : final;

  const text = needsFinal
    ? vowel + initial + actualFinal
    : initial + vowel + final;

  return { text, mastery: 1 };
};
