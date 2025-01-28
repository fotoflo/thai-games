import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ThaiLetter {
  thai: string;
  type: string;
  class: string;
  value: string;
  romanized: string;
  name: string;
  notes: string;
}

const ThaiSpelling: React.FC = () => {
  const letters: ThaiLetter[] = [
    {
      thai: "อ",
      type: "Initial Consonant",
      class: "Mid",
      value: "Silent initial",
      romanized: "(silent)",
      name: "or aang (basin)",
      notes:
        "Required as syllable starter when no other consonant begins the syllable",
    },
    {
      thai: "ย",
      type: "Consonant",
      class: "Low",
      value: "y",
      romanized: "y",
      name: "ya yak (giant)",
      notes: "Acts as part of compound vowel อยา",
    },
    {
      thai: "า",
      type: "Long Vowel",
      class: "-",
      value: "aa",
      romanized: "aa",
      name: "sara aa (vowel aa)",
      notes: 'Long "a" sound, written after consonant',
    },
    {
      thai: "ก",
      type: "Final Consonant",
      class: "Mid",
      value: "k",
      romanized: "k",
      name: "gor gai (chicken)",
      notes: 'Becomes unreleased "k" sound in final position',
    },
  ];

  const toneRules: string[] = [
    "Live syllable (ends in long vowel or sonorant)",
    "No tone marker present",
    "Initial consonant is low class (ย)",
    "Results in falling tone (เสียงโท)",
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <span className="text-4xl">อยาก</span>
          <span className="text-2xl text-gray-600">y-à-a-k</span>
          <span className="text-xl text-gray-500">&ldquo;to want&rdquo;</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-bold mb-3">Letter Breakdown</h3>
          <div className="grid grid-cols-4 gap-4">
            {letters.map((letter, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">{letter.thai}</div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span> {letter.name}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {letter.type}
                  </p>
                  <p>
                    <span className="font-semibold">Class:</span> {letter.class}
                  </p>
                  <p>
                    <span className="font-semibold">Value:</span> {letter.value}
                  </p>
                  <p>
                    <span className="font-semibold">In romanization:</span>{" "}
                    {letter.romanized}
                  </p>
                  <p className="text-gray-600 text-xs">{letter.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-3">Tone Rules</h3>
          <ul className="list-disc pl-5 space-y-2">
            {toneRules.map((rule, idx) => (
              <li key={idx} className="text-gray-700">
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3">Additional Notes</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              • The spelling อยา is a compound form representing the sound /yaa/
            </p>
            <p>• The initial อ is silent but required by Thai spelling rules</p>
            <p>
              • The final ก (k) creates a &ldquo;dead&rdquo; syllable, affecting
              the tone
            </p>
            <p>• The total pronunciation is yàak with a falling tone</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThaiSpelling;
