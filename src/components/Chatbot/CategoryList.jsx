import React from 'react';

const CategoryList = ({ categories, onSelectCategory }) => {
  return (
    <div>
      <h4 className="font-semibold mb-3">Select a topic:</h4>
      <div className="space-y-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="w-full text-left p-3 bg-gray-100 rounded hover:bg-secondary transition"
          >
            <span className="text-xl mr-2">{cat.icon}</span>
            <span>{cat.name}</span>
            <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;