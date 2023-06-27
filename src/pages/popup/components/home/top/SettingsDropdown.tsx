import React, { useEffect, useRef, useState } from 'react';
import {
  LogoutIcon,
  SettingsIcon
} from '@pages/popup/components/home/icons/icons';

interface Props {
  onLogout: () => Promise<void>;
}

const SettingsDropdown: React.FC<Props> = ({ onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  // Reference to the dropdown container div, used to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Close the dropdown menu when the user clicks outside of it
  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
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
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none ">
        <SettingsIcon iconClasses={'h-6 w-6 stroke-iron stroke-2'} />
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-4 w-24 text-white">
          <ul className="p-1 space-y-1 text-sm bg-big-stone rounded-lg">
            <li
              className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2 w-full"
              onClick={onLogout}
            >
              <LogoutIcon
                iconClasses={'w-5 h-5 stroke-magnesium stroke-2 mr-2'}
              />
              <span className="text-sm font-medium">Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
