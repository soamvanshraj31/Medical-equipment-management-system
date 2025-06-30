import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search devices by name..."
        value={value}
        onChange={handleChange}
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar; 