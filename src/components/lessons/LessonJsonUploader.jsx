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

  const promptText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...";

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
      // Basic validation
      if (!json.name || !json.items || !Array.isArray(json.items)) {
        throw new Error('Invalid lesson format: must include name and items array');
      }

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
      const json = JSON.parse(pastedText);
      validateAndSetJson(json);
    } catch (error) {
      setJsonError('Invalid JSON format: ' + error.message);
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
      const json = JSON.parse(text);
      validateAndSetJson(json);
    } catch (error) {
      setJsonError('Invalid JSON format: ' + error.message);
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
    <Card className="bg-gray-900 border-gray-800">
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
            <p className="mt-3 text-sm text-red-500">{jsonError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonJsonUploader; 