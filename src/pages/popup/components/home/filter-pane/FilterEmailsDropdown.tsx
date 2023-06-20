import React, { useState } from 'react';

function FilterEmailsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Enabled');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const selectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative text-center w-full flex h-full">
      <button
        type="button"
        className="inline-flex m-auto w-full h-2/4 justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 align-middle"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
      >
        Options
        <svg
          className="-mr-1 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className="absolute right-0 mt-[26px] w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          <a
            href="#"
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            id="menu-item-0"
          >
            Enabled
          </a>
          <a
            href="#"
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            id="menu-item-1"
          >
            Blocked
          </a>
          <a
            href="#"
            className="text-gray-700 block px-4 py-2 text-sm"
            role="menuitem"
            id="menu-item-2"
          >
            Deleted
          </a>
        </div>
      </div>
    </div>

    // <div className="hs-dropdown relative inline-flex h-[15px] align-middle text-center justify-center w-full">
    //   <button
    //     id="hs-dropdown-default"
    //     type="button"
    //     onClick={toggleDropdown}
    //     className=" w-[90%] hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
    //   >
    //     {selectedOption}
    //     <svg
    //       className="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-gray-600"
    //       width="16"
    //       height="16"
    //       viewBox="0 0 16 16"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
    //         stroke="currentColor"
    //         strokeWidth="2"
    //         strokeLinecap="round"
    //       />
    //     </svg>
    //   </button>
    //   {isOpen && (
    //     <div
    //       className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] hs-dropdown-open:opacity-100 opacity-0 w-72 z-10 mt-2 min-w-[15rem] bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700"
    //       aria-labelledby="hs-dropdown-default"
    //     >
    //       <a
    //         className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    //         href="#"
    //       >
    //         Newsletter
    //       </a>
    //       <a
    //         className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    //         href="#"
    //       >
    //         Purchases
    //       </a>
    //       <a
    //         className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    //         href="#"
    //       >
    //         Downloads
    //       </a>
    //       <a
    //         className="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
    //         href="#"
    //       >
    //         Team Account
    //       </a>
    //     </div>
    //   )}
    // </div>
    // <div className=" relative inline-block items-cente justify-center mx-auto m-auto">
    //   <div className={'text-center'}>
    //     <button
    //       onClick={toggleDropdown}
    //       type="button"
    //       className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    //       id="menu-button"
    //       aria-expanded="true"
    //       aria-haspopup="true"
    //     >
    //       {selectedOption}
    //       <svg
    //         className="-mr-1 h-5 w-5 text-gray-400"
    //         viewBox="0 0 20 20"
    //         fill="currentColor"
    //         aria-hidden="true"
    //       >
    //         <path
    //           fillRule="evenodd"
    //           d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
    //           clipRule="evenodd"
    //         />
    //       </svg>
    //     </button>
    //   </div>
    //   {isOpen && (
    //     <div
    //       className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    //       role="menu"
    //       aria-orientation="vertical"
    //       aria-labelledby="menu-button"
    //     >
    //       <div className="py-1" role="none">
    //         <button
    //           onClick={() => selectOption('Enabled')}
    //           className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
    //           role="menuitem"
    //           id="menu-item-0"
    //         >
    //           Enabled
    //         </button>
    //         <button
    //           onClick={() => selectOption('Blocked')}
    //           className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
    //           role="menuitem"
    //           id="menu-item-1"
    //         >
    //           Blocked
    //         </button>
    //         <button
    //           onClick={() => selectOption('Deleted')}
    //           className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
    //           role="menuitem"
    //           id="menu-item-2"
    //         >
    //           Deleted
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}

export default FilterEmailsDropdown;
