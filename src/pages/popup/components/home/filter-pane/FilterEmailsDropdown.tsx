import React, { useState } from 'react';

function FilterEmailsDropdown({
  onFilterChange
}: {
  onFilterChange: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All');
  const dropdownToEmailStateMap: { [key: string]: string } = {
    Enabled: 'enabled',
    Disabled: 'disabled',
    Deleted: 'deleted',
    All: 'all'
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    onFilterChange(dropdownToEmailStateMap[option]);
  };
  // Define the dropdown items with their labels and values
  const dropdownItems = [
    { label: 'All', value: 'All' },
    { label: 'Enabled', value: 'Enabled' },
    { label: 'Disabled', value: 'Disabled' },
    { label: 'Deleted', value: 'Deleted' }
  ];

  return (
    <div>
      <button
        id="dropdownCheckboxButton"
        data-dropdown-toggle="dropdownDefaultCheckbox"
        className="text-white ml-3.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            {dropdownItems.map((item: any) => (
              <li
                key={item.value}
                className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
                onClick={() => selectOption(item.value)}
              >
                <svg
                  className="w-4 h-4 mr-2 stroke-2"
                  aria-hidden="true"
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{item.label}</span>
                {selectedOption === item.value && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 ml-auto stroke-malibu stroke-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterEmailsDropdown;
