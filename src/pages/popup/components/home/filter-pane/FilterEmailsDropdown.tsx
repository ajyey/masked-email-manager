import React, { useState } from 'react';

function FilterEmailsDropdown({
  onFilterChange
}: {
  onFilterChange: (option: string) => void;
}) {
  const commonSvgClasses = 'w-5 h-5 mr-2';
  const dropdownItems = [
    {
      label: 'All',
      value: 'All',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${commonSvgClasses} stroke-mikado-yellow`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      )
    },
    {
      label: 'Enabled',
      value: 'Enabled',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${commonSvgClasses} stroke-eucalyptus`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    },
    {
      label: 'Disabled',
      value: 'Disabled',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${commonSvgClasses} stroke-magnesium`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
          />
        </svg>
      )
    },
    {
      label: 'Deleted',
      value: 'Deleted',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${commonSvgClasses} stroke-red-500`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      )
    }
  ];
  // State for the dropdown menu open/close status
  const [isOpen, setIsOpen] = useState(false);
  // State for the currently selected dropdown item
  const [selectedOption, setSelectedOption] = useState(dropdownItems[0]);
  // Map the dropdown item values to their fastmail masked email state values
  const dropdownToEmailStateMap: { [key: string]: string } = {
    Enabled: 'enabled',
    Disabled: 'disabled',
    Deleted: 'deleted',
    All: 'all'
  };
  // Toggle the dropdown menu open/close status
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Handle the dropdown item selection
  const selectOption = (dropdownOption: any) => {
    setSelectedOption(dropdownOption);
    setIsOpen(false); // Close the dropdown menu
    onFilterChange(dropdownToEmailStateMap[dropdownOption.value]); // Update the email state filter
  };
  // Define the dropdown items with their labels, values, and SVGs

  return (
    <div className="relative w-[98%]">
      <button
        id="dropdownButton"
        className="text-white focus:outline-none font-medium rounded-lg text-sm px-4 py-1 inline-flex items-center w-full hover:bg-french-blue "
        type="button"
        onClick={toggleDropdown}
      >
        {selectedOption.svg}
        {selectedOption.value}
        <svg
          className="w-4 h-4 ml-auto"
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
          id="dropdownOptionsContainer"
          className="absolute top-full w-full mt-1 rounded-lg text-white"
        >
          <ul className="p-1 space-y-1 text-sm bg-big-stone rounded-lg">
            {dropdownItems.map((dropdownItem: any) => (
              <li
                key={dropdownItem.value}
                className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
                onClick={() => selectOption(dropdownItem)}
              >
                {dropdownItem.svg}
                <span className="text-sm font-medium">
                  {dropdownItem.label}
                </span>
                {selectedOption.value === dropdownItem.value && (
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
