import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { speakText } from '@/utils/textToSpeech';

const WinDialog = ({ showWinDialog, setShowWinDialog, targetWord, nextWord, mergeVowels }) => (
  <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
    <AlertDialogContent className="bg-slate-50 bg-opacity-100 text-black">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl">Correct!</AlertDialogTitle>
        <AlertDialogDescription>
          <p className="text-3xl mb-4">{targetWord.thai}</p>
          <p className="mb-4">&quot;{targetWord.english}&quot; in English</p>
          <div className="flex justify-between mb-4">
            <Button onClick={() => speakText(targetWord.thai)} variant="outline" className="flex items-center">
              <Volume2 size={16} className="mr-2" />
              Play Full Word
            </Button>
            <Button onClick={() => nextWord()} variant="outline">
              Next Word
            </Button>
          </div>
          <div className="flex flex-wrap justify-center">
            {mergeVowels(targetWord.thai).map((char, index) => (
              <div key={index} className="flex items-center m-1">
                <Button 
                  onClick={() => speakText(char)} 
                  variant="outline"
                  className="mr-1"
                >
                  {char}
                </Button>
                <Button
                  onClick={() => speakText(char)}
                  variant="ghost"
                  size="icon"
                  className="p-0"
                >
                  <Volume2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={nextWord}>Next Word</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default WinDialog;