import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <Search size={19} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="이름, 프로젝트, 기술 스택으로 검색"
      />
    </label>
  );
}
