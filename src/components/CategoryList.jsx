import React from 'react';
import PropTypes from 'prop-types';

const CategoryList = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Catégories</h2>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-[#00E0FF] text-black font-medium'
                : 'bg-zinc-800/80 text-white hover:bg-zinc-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryList;
