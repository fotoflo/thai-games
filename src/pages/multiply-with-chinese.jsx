import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SkipForward, Clock, Calculator, Repeat } from 'lucide-react';

const Confetti = ({ active }) => {
  const confettiCount = 50;
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      {active && [...Array(confettiCount)].map((_, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: '-10px',
            left: `${Math.random() * 100}%`,
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: '50%',
            animation: `fall ${Math.random() * 3 + 2}s linear`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

const MultiplicationGame = () => {
  const [num1, setNum1] = useState(6);
  const [num2, setNum2] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(6);
  const [speakAnswer, setSpeakAnswer] = useState(true);
  const [points, setPoints] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [powerUps, setPowerUps] = useState({
    skip: 0,
    extraTime: 0,
    calculator: 0,
  });
  const questionRef = useRef(null);

  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  const toChineseNumber = (num) => {
    num = parseInt(num);
    if (isNaN(num) || num < 0) return '未定义';
    if (num <= 10) return chineseNumbers[num];
    if (num < 20) return `十${num > 10 ? chineseNumbers[num - 10] : ''}`;
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return `${chineseNumbers[tens]}十${ones === 0 ? '' : chineseNumbers[ones]}`;
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const tens = Math.floor((num % 100) / 10);
      const ones = num % 10;
      let result = `${chineseNumbers[hundreds]}百`;
      if (tens === 0 && ones === 0) return result;
      if (tens === 0) return result + '零' + chineseNumbers[ones];
      result += chineseNumbers[tens] + '十';
      if (ones === 0) return result;
      return result + chineseNumbers[ones];
    }
    return num.toString(); // For numbers 1000 and above
  };

  const generateQuestion = () => {
    const newNum1 = Math.floor(Math.random() * (13 - currentLevel)) + currentLevel;
    const newNum2 = Math.floor(Math.random() * 12) + 1;
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setFeedback('');
    questionRef.current = `${newNum1} ${newNum2} ${newNum1 * newNum2}`;
  };

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  useEffect(() => {
    const timeoutId = setTimeout(speakQuestion, 100);
    return () => clearTimeout(timeoutId);
  }, [num1, num2, speakAnswer]);

  const speakQuestion = () => {
    if (questionRef.current) {
      const [n1, n2, result] = questionRef.current.split(' ');
      const speakPart = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
      };

      speakPart(toChineseNumber(n1));
      setTimeout(() => {
        speakPart(toChineseNumber(n2));
        if (speakAnswer) {
          setTimeout(() => speakPart(toChineseNumber(result)), 1000);
        }
      }, 1000);
    }
  };

  const repeatQuestion = () => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    speakQuestion();
  };

  const calculatePoints = (num1, num2) => {
    const basePoints = num1 * num2;
    const bonus = consecutiveCorrect * 10;
    return basePoints + bonus;
  };

  const handleAnswer = (answer) => {
    const correctAnswer = num1 * num2;
    const correctDigits = correctAnswer.toString().length;

    if (answer.length === correctDigits) {
      setTotalQuestions(totalQuestions + 1);

      if (parseInt(answer) === correctAnswer) {
        const newPoints = calculatePoints(num1, num2);
        setPoints(points + newPoints);
        setConsecutiveCorrect(consecutiveCorrect + 1);
        setFeedback(`Correct! +${newPoints} points`);
        setScore(score + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000); // Turn off confetti after 3 seconds
        if (score > 0 && score % 5 === 0 && currentLevel < 12) {
          setCurrentLevel(currentLevel + 1);
        }
        setTimeout(generateQuestion, 1500);
      } else {
        const lostPoints = Math.floor((num1 * num2) / 2);
        setPoints(Math.max(0, points - lostPoints));
        setFeedback(`Incorrect! -${lostPoints} points.`);
        setConsecutiveCorrect(0);
      }
    }
  };

  const handleInputChange = (e) => {
    const answer = e.target.value;
    setUserAnswer(answer);
    handleAnswer(answer);
  };

  const buyPowerUp = (type) => {
    const costs = { skip: 50, extraTime: 100, calculator: 150 };
    if (points >= costs[type]) {
      setPoints(points - costs[type]);
      setPowerUps({ ...powerUps, [type]: powerUps[type] + 1 });
    } else {
      setFeedback("Not enough points to buy this power-up!");
    }
  };

  const handlePowerUp = (type) => {
    if (powerUps[type] > 0) {
      setPowerUps({ ...powerUps, [type]: powerUps[type] - 1 });
      switch (type) {
        case 'skip':
          generateQuestion();
          break;
        case 'extraTime':
          // Implement extra time logic here
          setFeedback("Extra time added!");
          break;
        case 'calculator':
          setUserAnswer((num1 * num2).toString());
          handleAnswer((num1 * num2).toString());
          break;
      }
    } else {
      setFeedback("You don't have this power-up!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Confetti active={showConfetti} />
      <Card className="w-96 p-6 bg-white rounded-xl shadow-md">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">Chinese Multiplication Flashcards</h1>
          <div className="flex items-center justify-center mb-4">
            <p className="text-xl mr-2">{num1} × {num2} = ?</p>
            <Button onClick={repeatQuestion} size="sm" variant="outline" className="p-1">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Enter your answer"
          />
          {feedback && <p className="text-center mb-4">{feedback}</p>}
          <p className="text-center">
            Score: {score} / {totalQuestions}
          </p>
          <p className="text-center mt-2">
            Points: {points}
          </p>
          <p className="text-center mt-2">
            Current Level: {currentLevel}+
          </p>
          <p className="text-center mt-2">
            Consecutive Correct: {consecutiveCorrect}
          </p>
          <div className="flex items-center justify-between mt-4">
            <label htmlFor="speak-answer" className="mr-2">Speak Answer:</label>
            <Switch
              id="speak-answer"
              checked={speakAnswer}
              onCheckedChange={setSpeakAnswer}
            />
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Power-ups:</h2>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => buyPowerUp('skip')} className="text-xs py-1 px-2">
                Skip (50)
              </Button>
              <Button onClick={() => buyPowerUp('extraTime')} className="text-xs py-1 px-2">
                Time (100)
              </Button>
              <Button onClick={() => buyPowerUp('calculator')} className="text-xs py-1 px-2">
                Calc (150)
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button onClick={() => handlePowerUp('skip')} disabled={powerUps.skip === 0} className="text-xs py-1 px-2">
                <SkipForward className="mr-1 h-3 w-3" /> {powerUps.skip}
              </Button>
              <Button onClick={() => handlePowerUp('extraTime')} disabled={powerUps.extraTime === 0} className="text-xs py-1 px-2">
                <Clock className="mr-1 h-3 w-3" /> {powerUps.extraTime}
              </Button>
              <Button onClick={() => handlePowerUp('calculator')} disabled={powerUps.calculator === 0} className="text-xs py-1 px-2">
                <Calculator className="mr-1 h-3 w-3" /> {powerUps.calculator}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplicationGame;