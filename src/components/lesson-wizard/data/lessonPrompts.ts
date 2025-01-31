export const LESSON_CREATION_PROMPT = `I'll help you create a language learning lesson. Please ask the user these questions in sequence:

1. First, ask them to choose a language pair:
   1. Thai for English Speakers
   2. Chinese for English Speakers
   3. Thai for Chinese-English Bilinguals (includes both Chinese and English translations)
   4. Japanese for English Speakers
   5. Korean for English Speakers
   6. Other (let them specify)

2. Then, ask them what type of lesson they'd like:
   1. Common Phrases & Expressions
   2. Real-life Situations & Dialogues
   3. Core Vocabulary
   4. Grammar Patterns
   5. Cultural Topics
   6. Other (let them specify)

3. Based on their previous choices, suggest 9 numbered topic options. For example:

   For Thai Phrases (Beginner):
   1. Morning and Evening Greetings
   2. Basic Thank You and Sorry
   3. Simple Self-Introductions
   4. Numbers and Counting
   5. Yes/No Questions

   For Chinese Situations (Intermediate):
   1. Bargaining at the Market
   2. Making a Reservation
   3. Job Interview Basics
   4. Doctor's Appointment
   5. Banking Transactions

   For Japanese Vocabulary (Advanced):
   1. Business Honorifics
   2. Technical Terms
   3. Academic Language
   4. Legal Terminology
   5. Medical Vocabulary

4. Ask them to choose a difficulty level:
   1. BEGINNER (basic vocabulary, simple phrases, everyday situations)
   2. INTERMEDIATE (more complex phrases, varied vocabulary, practical conversations)
   3. ADVANCED (formal language, nuanced expressions, specialized topics)`;

export const LESSON_SCHEMA_EXAMPLE = `{
  "name": "Title of the Lesson (in both languages if bilingual)", // max length 48 chars
  "description": "A clear description of what will be learned", // max length 128 chars
  "subject": "Main subject area (e.g., Thai Language)", // max length 48 chars
  "categories": [
    {
      "id": "category-1",
      "name": "Category Name"
    }
  ],
  "difficulty": "BEGINNER",  // Must be: BEGINNER, INTERMEDIATE, or ADVANCED
  "estimatedTime": 30,       // Time in minutes
  "totalItems": 1,           // Number of items in the lesson
  "version": 1,
  "items": [
    {
      "id": "food-001",
      "sides": [
        {
          "markdown": "<span style='color: #FF4545'>ผัด</span><span style='color: #4545FF'>ไทย</span>",
          "metadata": {
            "pronunciation": "pad-thai"
          }
        },
        {
          "markdown": "*pad-thai*<br /><br />炒河粉 (chǎo hé fěn)<br /><br />Pad Thai (stir-fried rice noodles)<br /><br />Example sentences:\\n1. ผัดไทยร้านนี้อร่อยมาก\\n(pad-thai raan nee aroi maak)\\nThe pad thai at this restaurant is very delicious<br /><br />2. คุณชอบผัดไทยไหม\\n(khun chop pad-thai mai)\\nDo you like pad thai?"
        }
      ],
      "tags": ["food", "noodles", "popular"],
      "categories": ["vocabulary", "food"],
      "intervalModifier": 1
    }
  ]
}`;

export const FORMATTING_NOTES = `Important formatting notes:
1. For Thai words, use tone colors with spans:
   - Rising tone: <span style='color: #FF4545'>rising</span>
   - Falling tone: <span style='color: #4545FF'>falling</span>

2. For Chinese-Thai-English lessons:
   - Include Chinese characters with pinyin in parentheses
   - Format for side 2: "*thai-pronunciation*<br /><br />汉字 (hàn zì)<br /><br />english-meaning<br /><br />Example sentences:\\n1. Thai sentence\\n(pronunciation)\\nEnglish translation<br /><br />2. Thai sentence\\n(pronunciation)\\nEnglish translation"`;
