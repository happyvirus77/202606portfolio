import { categories } from '../data/students.js';

export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div className="category-filter" aria-label="카테고리 필터">
      {categories.map((category) => (
        <button
          className={activeCategory === category ? 'category-chip active' : 'category-chip'}
          key={category}
          type="button"
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
