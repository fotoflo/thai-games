import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Book, 
  Plus,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

const GuidedLessonCreator = ({ onClose }) => {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [jsonContent, setJsonContent] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const popularSubjects = [
    { id: 'thai', name: 'Thai', icon: '🇹🇭' },
    { id: 'japanese', name: 'Japanese', icon: '🇯🇵' },
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'history', name: 'History', icon: '📚' },
  ];

  const popularTopics = [
    { id: 'food', name: 'Food & Dining', icon: '🍜' },
    { id: 'travel', name: 'Travel Basics', icon: '✈️' },
    { id: 'greetings', name: 'Greetings', icon: '👋' },
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-100">Create New Lesson</h1>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${isJsonMode ? 'text-gray-400' : 'text-gray-100'}`}>AI Wizard</span>
            <button
              onClick={() => setIsJsonMode(!isJsonMode)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                ${isJsonMode ? 'bg-blue-600' : 'bg-gray-700'}
              `}
            >
              <span className={`
                ${isJsonMode ? 'translate-x-6' : 'translate-x-1'}
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              `} />
            </button>
            <span className={`text-sm ${isJsonMode ? 'text-gray-100' : 'text-gray-400'}`}>JSON Upload</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-8">
          {isJsonMode ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-100">
                    <Book className="h-5 w-5" />
                    <h2 className="text-lg font-medium">Upload Lesson JSON</h2>
                  </div>
                  {jsonContent && (
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setJsonContent(null);
                        setJsonError(null);
                      }}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      Clear
                    </Button>
                  )}
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
                    </div>
                  ) : jsonError ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center text-red-500">
                        <XCircle className="h-8 w-8" />
                      </div>
                      <p className="text-gray-300">Invalid JSON format</p>
                      <p className="text-sm text-red-400">{jsonError}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input 
                        type="file" 
                        accept=".json"
                        className="hidden"
                        id="json-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              try {
                                const json = JSON.parse(e.target?.result?.toString() || '');
                                setJsonContent(json);
                                setJsonError(null);
                              } catch (error) {
                                setJsonError(error.message || 'Could not parse JSON file');
                                setJsonContent(null);
                              }
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="json-upload"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        <Plus className="h-6 w-6" />
                        <span>Choose JSON file</span>
                      </label>
                      <p className="text-sm text-gray-500">
                        Upload a lesson JSON file that matches the required schema
                      </p>
                    </div>
                  )}
                </div>

                {jsonContent && (
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      className="border-gray-700 hover:bg-gray-800"
                      onClick={() => {
                        setJsonContent(null);
                        setJsonError(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={onClose}
                    >
                      Import Lesson
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Subject Selection */}
              {!selectedSubject && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-gray-100">
                      <Book className="h-5 w-5" />
                      <h2 className="text-lg font-medium">Choose Subject</h2>
                    </div>
                    
                    {isCreatingSubject ? (
                      <div className="space-y-2">
                        <Input
                          autoFocus
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="Enter subject name..."
                          className="bg-gray-800 border-gray-700 text-gray-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSubject) {
                              setSelectedSubject({ 
                                id: newSubject.toLowerCase(), 
                                name: newSubject,
                                icon: '📚'
                              });
                              setIsCreatingSubject(false);
                            } else if (e.key === 'Escape') {
                              setIsCreatingSubject(false);
                            }
                          }}
                        />
                        <p className="text-sm text-gray-400">
                          Press Enter to confirm or Escape to cancel
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {popularSubjects.map(subject => (
                          <Button
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject)}
                            variant="outline"
                            className="justify-start text-lg border-gray-700 hover:bg-gray-800"
                          >
                            <span className="mr-2 text-2xl">{subject.icon}</span>
                            {subject.name}
                          </Button>
                        ))}
                        <Button 
                          variant="outline" 
                          className="border-gray-700 hover:bg-gray-800"
                          onClick={() => {
                            setIsCreatingSubject(true);
                            setNewSubject('');
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Subject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Level Selection */}
              {selectedSubject && !selectedLevel && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-gray-100">
                      <GraduationCap className="h-5 w-5" />
                      <h2 className="text-lg font-medium">Choose Level</h2>
                    </div>
                    
                    {isCreatingLevel ? (
                      <div className="space-y-2">
                        <Input
                          autoFocus
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value)}
                          placeholder="Enter level name..."
                          className="bg-gray-800 border-gray-700 text-gray-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newLevel) {
                              setSelectedLevel({ 
                                id: newLevel.toLowerCase(), 
                                name: newLevel 
                              });
                              setIsCreatingLevel(false);
                            } else if (e.key === 'Escape') {
                              setIsCreatingLevel(false);
                            }
                          }}
                        />
                        <p className="text-sm text-gray-400">
                          Press Enter to confirm or Escape to cancel
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {levels.map(level => (
                          <Button
                            key={level.id}
                            onClick={() => setSelectedLevel(level)}
                            variant="outline"
                            className="border-gray-700 hover:bg-gray-800"
                          >
                            {level.name}
                          </Button>
                        ))}
                        <Button 
                          variant="outline" 
                          className="border-gray-700 hover:bg-gray-800"
                          onClick={() => {
                            setIsCreatingLevel(true);
                            setNewLevel('');
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Level
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Topic Selection */}
              {selectedLevel && !selectedTopic && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-gray-100">
                      <Book className="h-5 w-5" />
                      <h2 className="text-lg font-medium">Choose Topic</h2>
                    </div>
                    
                    {isCreatingTopic ? (
                      <div className="space-y-2">
                        <Input
                          autoFocus
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Enter topic name..."
                          className="bg-gray-800 border-gray-700 text-gray-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newTopic) {
                              setSelectedTopic({ 
                                id: newTopic.toLowerCase(), 
                                name: newTopic,
                                icon: '📝'
                              });
                              setIsCreatingTopic(false);
                            } else if (e.key === 'Escape') {
                              setIsCreatingTopic(false);
                            }
                          }}
                        />
                        <p className="text-sm text-gray-400">
                          Press Enter to confirm or Escape to cancel
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {popularTopics.map(topic => (
                          <Button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic)}
                            variant="outline"
                            className="justify-start text-lg border-gray-700 hover:bg-gray-800"
                          >
                            <span className="mr-2 text-2xl">{topic.icon}</span>
                            {topic.name}
                          </Button>
                        ))}
                        <Button 
                          variant="outline" 
                          className="border-gray-700 hover:bg-gray-800"
                          onClick={() => {
                            setIsCreatingTopic(true);
                            setNewTopic('');
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Generated Cards Preview */}
              {selectedTopic && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-100">
                        <span className="text-2xl">{selectedSubject.icon}</span>
                        <h2 className="text-lg font-medium">
                          {selectedTopic.name} - {selectedLevel.name}
                        </h2>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-700 hover:bg-gray-800"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="text-lg text-gray-100">สวัสดี</div>
                              <div className="text-sm text-gray-400">sa-wat-dee</div>
                              <div className="text-base text-gray-300">Hello</div>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                        Customize
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Create Lesson
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidedLessonCreator; 