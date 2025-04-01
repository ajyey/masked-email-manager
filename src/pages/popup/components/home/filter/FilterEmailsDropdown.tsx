import React, { useEffect, useRef, useState } from 'react';
import { DropdownButtonIcon } from '@pages/popup/components/home/icons/icons';
import {
  FILTER_OPTIONS,
  FilterOption
} from '@pages/popup/components/home/filter/FilterOption';

interface FilterEmailsDropdownProps {
  setFilterOption: (
    value: ((prevState: FilterOption) => FilterOption) | FilterOption
  ) => void;
  filterOption: FilterOption;
}

function FilterEmailsDropdown({
  setFilterOption,
  filterOption
}: FilterEmailsDropdownProps) {
  // State for the dropdown menu open/close status
  const [isOpen, setIsOpen] = useState(false);
  // State for the currently selected dropdown item
  const [selectedOption, setSelectedOption] = useState(filterOption);

  // Toggle the dropdown menu open/close status
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Set the selected dropdown item to the current filter option when the filter option changes
  useEffect(() => {
    setSelectedOption(filterOption);
    setIsOpen(false);
  }, [filterOption]);

  // Reference to the dropdown container div, used to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Close the dropdown menu when the user clicks outside of it
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
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
        className="text-white focus:outline-hidden font-medium rounded-lg text-sm px-4 py-1 inline-flex items-center w-[98%] ml-1 mr-1 hover:bg-big-stone/[0.75]"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedOption.icon}
        {selectedOption.value}
        <DropdownButtonIcon iconClasses={'w-4 h-4 ml-auto'} />
      </button>
      {/*Render the dropdown conditionally*/}
      {isOpen && (
        <div
          id="dropdownOptionsContainer"
          className="absolute top-full w-full mt-1 rounded-lg text-white"
        >
          <ul className="p-1 space-y-1 text-sm bg-big-stone rounded-lg ml-1">
            {Object.keys(FILTER_OPTIONS).map((option) => {
              const key = option as keyof typeof FILTER_OPTIONS;
              const filterOption = FILTER_OPTIONS[key];
              return (
                <FilterOption
                  key={filterOption.value}
                  item={filterOption}
                  isSelected={selectedOption.value === filterOption.value}
                  onClick={() => setFilterOption(filterOption)}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FilterEmailsDropdown;
