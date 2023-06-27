import React, { useEffect, useRef, useState } from 'react';
import {
  AllIcon,
  CheckedDropdownItemIcon,
  DeletedIcon,
  DisabledIcon,
  DropdownButtonIcon,
  EnabledIcon,
  FavoriteIcon
} from '@pages/popup/components/home/icons/icons';

interface DropdownItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function FilterEmailsDropdown({
  onFilterChange
}: {
  onFilterChange: (option: string) => void;
}) {
  const dropdownItems: DropdownItem[] = [
    {
      label: 'Favorited',
      value: 'Favorited',
      icon: (
        <FavoriteIcon iconClasses={'fill-mikado-yellow stroke-mikado-yellow'} />
      )
    },
    {
      label: 'All',
      value: 'All',
      icon: <AllIcon iconClasses={'stroke-mikado-yellow'} />
    },
    {
      label: 'Enabled',
      value: 'Enabled',
      icon: <EnabledIcon iconClasses={'stroke-eucalyptus'} />
    },
    {
      label: 'Disabled',
      value: 'Disabled',
      icon: <DisabledIcon iconClasses={'stroke-magnesium'} />
    },
    {
      label: 'Deleted',
      value: 'Deleted',
      icon: <DeletedIcon iconClasses={'stroke-red-500'} />
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
    All: 'all',
    Favorited: 'favorited'
  };
  // Toggle the dropdown menu open/close status
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Handle the dropdown item selection
  const selectOption = (dropdownOption: DropdownItem) => {
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
        className="text-white focus:outline-none font-medium rounded-lg text-sm px-4 py-1 inline-flex items-center w-[98%] ml-1 mr-1 hover:bg-big-stone/[0.75]"
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
            {dropdownItems.map((dropdownItem: DropdownItem) => (
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
                  <CheckedDropdownItemIcon
                    iconClasses={'w-4 h-4 ml-auto stroke-malibu stroke-3'}
                  />
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
