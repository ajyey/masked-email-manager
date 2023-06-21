// SearchBar.tsx
import React, { useState } from 'react';

interface Props {
  onSearchChange: (searchQuery: string) => void;
}

function SearchBar({ onSearchChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  return (
    <div className="relative w-full items-center p-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        id="simple-search"
        className="bg-big-stone text-sm text-white rounded-[5px] w-full pl-10 h-[35px] items-center p-2.5 focus:outline-none"
        placeholder="Search Masked Emails..."
        style={{ caretColor: 'white' }}
        onChange={handleChange}
        value={searchQuery}
      ></input>
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={clearSearch}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9.293l4.146-4.147a.5.5 0 01.708.708L10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 01-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
