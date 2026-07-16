import React from 'react';
import { useParams } from 'react-router-dom';

function QuizDetailPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="skeleton h-96"></div>
        <p className="text-gray-400 mt-4">Carregando detalhes do quiz...</p>
      </div>
    </div>
  );
}

export default QuizDetailPage;
