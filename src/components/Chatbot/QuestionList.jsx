import React from 'react';

const QuestionList = ({ category, questions, onSelectQuestion, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="text-primary mb-3 flex items-center">
        ← Back to categories
      </button>
      <h4 className="font-semibold mb-3">{category.name}</h4>
      <div className="space-y-2">
        {questions.map(q => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(q.id)}
            className="w-full text-left p-3 bg-gray-100 rounded hover:bg-secondary transition"
          >
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;