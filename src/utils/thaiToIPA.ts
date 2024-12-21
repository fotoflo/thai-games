// Type definition for the mapping of Thai characters to IPA
type ThaiToIPAMap = {
  [key: string]: string;
};

// The mapping of Thai characters to their IPA representations
const thaiToIPAMap: ThaiToIPAMap = {
  ก: "k",
  ข: "kʰ",
  ค: "kʰ",
  ง: "ŋ",
  จ: "t͡ɕ",
  ฉ: "t͡ɕʰ",
  ช: "t͡ɕʰ",
  ซ: "s",
  ฌ: "t͡ɕʰ",
  ญ: "j",
  ฎ: "d",
  ฏ: "t",
  ฐ: "tʰ",
  ฑ: "tʰ",
  ฒ: "tʰ",
  ณ: "n",
  ด: "d",
  ต: "t",
  ถ: "tʰ",
  ท: "tʰ",
  ธ: "tʰ",
  น: "n",
  บ: "b",
  ป: "p",
  ผ: "pʰ",
  ฝ: "f",
  พ: "pʰ",
  ฟ: "f",
  ภ: "pʰ",
  ม: "m",
  ย: "j",
  ร: "r",
  ล: "l",
  ว: "w",
  ศ: "s",
  ษ: "s",
  ส: "s",
  ห: "h",
  า: "aː",
  "ี": "iː",
  "ู": "uː",
  "ุ": "u",
  เ: "eː",
  แ: "ɛː",
  โ: "oː",
  ไ: "aj",
};

/**
 * Converts Thai text to IPA (International Phonetic Alphabet) notation
 * @param thaiWord - The Thai text to convert
 * @returns The IPA representation of the input Thai text
 */
export const thaiToIPA = (thaiWord: string): string => {
  return Array.from(thaiWord)
    .map((char) => thaiToIPAMap[char] || char)
    .join("");
};
