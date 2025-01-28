import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle2, FileUp, Type, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const LessonJsonUploader = ({ onUploadSuccess }) => {
  const [jsonContent, setJsonContent] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('paste');
  const [pastedText, setPastedText] = useState('');
  const [copied, setCopied] = useState(false);

  const promptText = `I'll help you create a language learning lesson. Please ask the user these questions in sequence:

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
   3. ADVANCED (formal language, nuanced expressions, specialized topics)

Finally create a lesson using this JSON schema with 20 items:

{
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
          "markdown": "<span style='color: #FF4545'>ผัด</span><span style='color: #4545FF'>ไทย</span>", // max length of actual content, not including HTML/markdown tags: 32 chars
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
}

Important formatting notes:
1. For Thai words, use tone colors with spans:
   - Rising tone: <span style='color: #FF4545'>rising</span>
   - Falling tone: <span style='color: #4545FF'>falling</span>

2. For Chinese-Thai-English lessons:
   - Include Chinese characters with pinyin in parentheses
   - Format for side 2: "*thai-pronunciation*<br /><br />汉字 (hàn zì)<br /><br />english-meaning<br /><br />Example sentences:\\n1. Thai sentence\\n(pronunciation)\\nEnglish translation<br /><br />2. Thai sentence\\n(pronunciation)\\nEnglish translation"

Please ask the questions one at a time and wait for the user's response before proceeding. For each question, they should be able to respond with just a number. After gathering all responses, create a complete lesson following the schema above.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const validateAndSetJson = (json) => {
    try {
      // Check for required fields with descriptive error messages
      const requiredFields = {
        name: "Lesson name",
        description: "Lesson description",
        categories: "Categories array",
        subject: "Subject",
        difficulty: "Difficulty level (BEGINNER, INTERMEDIATE, or ADVANCED)",
        estimatedTime: "Estimated completion time",
        totalItems: "Total number of items",
        version: "Lesson version",
        items: "Lesson items array"
      };

      const missingFields = [];
      for (const [field, description] of Object.entries(requiredFields)) {
        if (field === 'difficulty') {
          if (!json[field] || !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(json[field].toUpperCase())) {
            missingFields.push(`${description} must be one of: BEGINNER, INTERMEDIATE, ADVANCED`);
          }
        } else if (!json[field]) {
          missingFields.push(description);
        }
      }

      // Check items array structure if it exists
      if (json.items && Array.isArray(json.items)) {
        json.items.forEach((item, index) => {
          if (!item.id) missingFields.push(`Item ${index + 1} is missing an ID`);
          if (!item.sides || !Array.isArray(item.sides) || item.sides.length !== 2) {
            missingFields.push(`Item ${index + 1} must have exactly 2 sides`);
          } else {
            item.sides.forEach((side, sideIndex) => {
              if (!side.markdown) {
                missingFields.push(`Item ${index + 1}, side ${sideIndex + 1} is missing markdown content`);
              }
            });
          }
          if (!item.tags || !Array.isArray(item.tags)) missingFields.push(`Item ${index + 1} is missing tags array`);
          if (!item.categories || !Array.isArray(item.categories)) missingFields.push(`Item ${index + 1} is missing categories array`);
          if (typeof item.intervalModifier !== 'number') missingFields.push(`Item ${index + 1} is missing intervalModifier number`);
        });
      }

      if (missingFields.length > 0) {
        throw new Error('Missing required fields:\n- ' + missingFields.join('\n- '));
      }

      // If we get here, basic validation passed
      setJsonContent(json);
      setJsonError(null);
    } catch (error) {
      console.error('Error validating JSON:', error);
      setJsonError(error.message);
      setJsonContent(null);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      validateAndSetJson(json);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setJsonError(error.message);
      setJsonContent(null);
    }
  };

  const handlePastedJson = () => {
    console.log("pastedText", pastedText);
    try {
      // First try to parse the JSON and provide helpful formatting tips if it fails
      let json;
      try {
        json = JSON.parse(pastedText);
      } catch (parseError) {
        const errorMessage = parseError.message;
        let helpfulMessage = 'Invalid JSON format. Common issues to check:\n';
        helpfulMessage += '- Ensure all property names are in double quotes (e.g., "name": "value")\n';
        helpfulMessage += '- Check for missing commas between properties\n';
        helpfulMessage += '- Ensure arrays and objects are properly closed\n';
        helpfulMessage += '- Remove any trailing commas\n\n';
        helpfulMessage += 'Parser error: ' + errorMessage;
        
        setJsonError(helpfulMessage);
        setJsonContent(null);
        return;
      }

      validateAndSetJson(json);
    } catch (error) {
      setJsonError(error.message);
      setJsonContent(null);
    }
  };

  const handlePaste = (e) => {
    console.log("Paste event triggered");
    e.preventDefault(); // Prevent default paste behavior
    
    // Get pasted text from clipboard event
    const text = e.clipboardData?.getData('text') || '';
    console.log("Pasted text:", text);
    setPastedText(text);
    
    try {
      // First try to parse the JSON and provide helpful formatting tips if it fails
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        const errorMessage = parseError.message;
        let helpfulMessage = 'Invalid JSON format. Common issues to check:\n';
        helpfulMessage += '- Ensure all property names are in double quotes (e.g., "name": "value")\n';
        helpfulMessage += '- Check for missing commas between properties\n';
        helpfulMessage += '- Ensure arrays and objects are properly closed\n';
        helpfulMessage += '- Remove any trailing commas\n\n';
        helpfulMessage += 'Parser error: ' + errorMessage;
        
        setJsonError(helpfulMessage);
        setJsonContent(null);
        return;
      }

      validateAndSetJson(json);
    } catch (error) {
      setJsonError(error.message);
      setJsonContent(null);
    }
  };

  const handleChange = (e) => {
    console.log("Change event triggered");
    const newText = e.target.value;
    setPastedText(newText);
  };

  const handleSubmit = async () => {
    if (!jsonContent) return;
    
    setIsSubmitting(true);
    try {
      // Transform the lesson data to match Prisma schema
      const transformedLesson = {
        ...jsonContent,
        difficulty: jsonContent.difficulty.toUpperCase(),
      };

      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedLesson),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }

      const data = await response.json();
      console.log('Lesson created:', data);
      onUploadSuccess(data);
    } catch (error) {
      console.error('Error creating lesson:', error);
      setJsonError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setJsonContent(null);
    setJsonError(null);
    setPastedText('');
  };

  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-100">
            <h2 className="text-lg font-medium">Upload Lesson JSON</h2>
          </div>
          {(jsonContent || pastedText) && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-300"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Prompt Copy Section */}
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-500 font-medium">
            Copy this prompt into your AI Assistant to create a lesson
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-md group relative">
            <div className="flex-1 truncate text-sm text-gray-400">
              {promptText}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPrompt}
              className="shrink-0 text-gray-400 hover:text-gray-300"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Upload Method Tabs */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setUploadMethod('file')}
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              uploadMethod === 'file'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              File Upload
            </div>
          </button>
          <button
            onClick={() => setUploadMethod('paste')}
            className={`px-4 py-2 -mb-px text-sm font-medium ${
              uploadMethod === 'paste'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Paste JSON
            </div>
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          {jsonContent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center text-green-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-gray-300">JSON validated successfully</p>
              <p className="text-sm text-gray-400">
                {jsonContent.name || 'Untitled Lesson'} • {
                  jsonContent.items?.length || 0
                } cards
              </p>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-4"
              >
                {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
              </Button>
            </div>
          ) : uploadMethod === 'file' ? (
            <div className="space-y-3">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="json-upload"
              />
              <label
                htmlFor="json-upload"
                className="cursor-pointer inline-flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-gray-300">
                  Click to upload JSON file
                </span>
                <span className="text-sm text-gray-400">
                  or drag and drop
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={pastedText}
                onChange={handleChange}
                onPaste={handlePaste}
                placeholder="Paste your JSON here... (Ctrl+V or ⌘+V)"
                className="min-h-[200px] bg-gray-800 border-gray-700 text-gray-100 font-mono whitespace-pre"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handlePastedJson}
                  disabled={!pastedText}
                  className="flex-1"
                >
                  Validate JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPastedText('')}
                  disabled={!pastedText}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          {jsonError && (
            <div className="mt-3 text-sm text-red-500 text-left whitespace-pre-wrap bg-red-500/10 p-4 rounded-md border border-red-500/20 font-mono">
              {jsonError.includes('Invalid JSON format') ? (
                // JSON parsing error
                <div className="space-y-2">
                  <div className="font-semibold">JSON Format Error</div>
                  {jsonError}
                </div>
              ) : jsonError.includes('Validation failed') ? (
                // Validation error from API
                <div className="space-y-2">
                  <div className="font-semibold">Validation Errors</div>
                  {jsonError.split('\n').map((line, i) => (
                    <div key={i} className={`${line.startsWith('  -') ? 'pl-4 text-red-400' : line.includes(':') ? 'font-medium text-red-500' : ''}`}>
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                // Other errors
                <div className="space-y-2">
                  <div className="font-semibold">Error</div>
                  {jsonError}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonJsonUploader; 