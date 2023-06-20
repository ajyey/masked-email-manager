import React, { useState } from 'react';

function FilterEmailsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Enabled');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div>
      <button
        id="dropdownCheckboxButton"
        data-dropdown-toggle="dropdownDefaultCheckbox"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedOption}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {/*Render the dropdown conditionally*/}
      {isOpen && (
        <div
          id="dropdownDefaultCheckbox"
          className="absolute w-48 rounded-lg text-white"
        >
          <ul
            className="p-3 space-y-3 text-sm bg-big-stone rounded-lg"
            aria-labelledby="dropdownCheckboxButton"
          >
            <li
              className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
              onClick={() => selectOption('Enabled')}
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Enabled</span>
            </li>
            <li
              className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
              onClick={() => selectOption('Disabled')}
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Disabled</span>
            </li>
            <li
              className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
              onClick={() => selectOption('Deleted')}
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium ">Deleted</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterEmailsDropdown;
