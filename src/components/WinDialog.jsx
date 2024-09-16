import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const WinDialog = ({ showWinDialog, setShowWinDialog, targetWord, speakText, nextWord, mergeVowels }) => (
  <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Correct!</AlertDialogTitle>
        <AlertDialogDescription>
          <p className="text-2xl mb-4">{targetWord.thai}</p>
          <p className="mb-4">&quot;{targetWord.english}&quot; in English</p>
          <div className="flex justify-between mb-4">
            <Button onClick={() => speakText(targetWord.thai)}>
              Play Full Word
            </Button>
            <Button onClick={() => nextWord()}>
              Next Word
            </Button>
          </div>
          <div className="flex flex-wrap justify-center">
            {mergeVowels(targetWord.thai).map((char, index) => (
              <Button 
                key={index} 
                onClick={() => speakText(char)} 
                className="m-1"
              >
                {char}
              </Button>
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