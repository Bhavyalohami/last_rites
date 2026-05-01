import React from 'react';

const AnswerView = ({ question, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="text-primary mb-3 flex items-center">
        ← Back to questions
      </button>
      <h4 className="font-semibold mb-2">{question.question}</h4>
      <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
        {question.answer}
      </div>
    </div>
  );
};

export default AnswerView;