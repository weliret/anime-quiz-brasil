import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function QuizPlayPage() {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Quiz</h1>
          <div className="text-2xl font-bold text-neon-blue">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span>Questão {currentQuestion + 1}</span>
            <span>10 questões</span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-neon h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card mb-8">
          <p className="text-gray-400 mb-4">Carregando questão...</p>
        </div>
      </div>
    </div>
  );
}

export default QuizPlayPage;
