import React, { useEffect, useRef, useState } from 'react';
import {
  AllIcon,
  DeletedIcon,
  DisabledIcon,
  EnabledIcon
} from '@pages/popup/components/home/icons/icons';

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
      icon: <AllIcon className={`${commonSvgClasses} stroke-mikado-yellow`} />
    },
    {
      label: 'Enabled',
      value: 'Enabled',
      icon: <EnabledIcon className={`${commonSvgClasses} stroke-eucalyptus`} />
    },
    {
      label: 'Disabled',
      value: 'Disabled',
      icon: <DisabledIcon className={`${commonSvgClasses} stroke-magnesium`} />
    },
    {
      label: 'Deleted',
      value: 'Deleted',
      icon: <DeletedIcon className={`${commonSvgClasses} stroke-red-500`} />
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
  // Reference to the dropdown container div, used to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown menu when the user clicks outside of it
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Set up an event listener for clicks outside the dropdown and remove it on component unmount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-[98%]">
      <button
        id="dropdownButton"
        className="text-white focus:outline-none font-medium rounded-lg text-sm px-4 py-1 inline-flex items-center w-full hover:bg-big-stone/[0.75]"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedOption.icon}
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
                {dropdownItem.icon}
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
