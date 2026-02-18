import React, { useState } from 'react';
import { questions } from '../data/questions';

const Quiz = ({ onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    Object.values(finalAnswers).forEach((val) => {
      scores[val] = (scores[val] || 0) + 1;
    });

    // Determine types. Tie-breaking logic: E>I, S>N, T>F, J>P if equal?
    // Actually, with 2 questions, if 1-1, let's default to the letter that comes first in alphabet? No that's arbitrary.
    // Let's just use > so if 1 vs 1, it goes to the second one (<=).
    // E vs I: If E > I then E else I. (So 1-1 -> I)
    // S vs N: If S > N then S else N. (So 1-1 -> N)
    // T vs F: If T > F then T else F. (So 1-1 -> F)
    // J vs P: If J > P then J else P. (So 1-1 -> P)
    // This biases towards INFP in ties. That's fine for a fun quiz.

    const mbti = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P',
    ].join('');

    onFinish(mbti);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6 transition-colors duration-300">
      <div className="w-full max-w-xl">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8 transition-colors duration-300">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center min-h-[100px] flex items-center justify-center leading-snug drop-shadow-sm transition-colors duration-300">
          <span className="text-blue-600 dark:text-blue-400 mr-2">Q{currentQuestion.id}.</span>
          {currentQuestion.text}
        </h2>

        <div className="flex flex-col gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className="w-full py-5 px-8 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-2xl text-lg md:text-xl text-left transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md font-medium text-gray-700 dark:text-gray-200"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
