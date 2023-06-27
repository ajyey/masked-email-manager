import React, { useState } from 'react';
import icon from '@assets/img/icon.svg';
import SearchBar from '@pages/popup/components/home/top/SearchBar';
import { LogoutIcon } from '@pages/popup/components/home/icons/icons';

interface Props {
  onSearchChange: (searchQuery: string) => void;
  onRefresh: () => Promise<void>;
}

export default function TopComponent({ onSearchChange, onRefresh }: Props) {
  // Handler for when the user clicks the refresh button
  // Calls the refreshMaskedEmails function from src/pages/popup/components/home/Home.tsx
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };
  // State for the refresh button - keeps track of when we are done fetching the list of emails from the Fastmail API
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <section className="inline-flex h-[55px] items-center border-b border-big-stone w-full">
      <div className="w-full">
        <div className="inline-flex">
          {/*LOGO*/}
          <div className="flex items-center">
            <a
              href="https://github.com/ajyey/masked-email-manager"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={icon}
                className="pointer-events-none h-7 w-11 ml-1.5 mr-1 mb-1"
                alt="icon"
              />
            </a>
          </div>
          {/*SEARCH BAR*/}
          <div className="w-96">
            <SearchBar onSearchChange={onSearchChange} />
          </div>
          {/*REFRESH BUTTON*/}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="text-white focus:outline-none"
              onClick={handleRefresh}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className={`w-5 h-5 stroke-iron m-1 ${
                  isRefreshing ? 'animate-spin-fast' : ''
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          {/*CREATE EMAIL BUTTON*/}
          <div className="flex items-center">
            <div className="relative w-full p-1 mb-1">
              <button
                type="button"
                className="text-white bg-french-blue font-bold rounded text-sm px-2.5 h-9 text-center inline-flex items-center"
              >
                <svg
                  width="16"
                  height="16"
                  data-path-count="1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 text-white fill-current"
                >
                  <path
                    data-path-style="onLight"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 2a1 1 0 0 0-1 1v4H3a1 1 0 0 0 0 2h4v4a1 1 0 1 0 2 0V9h4a1 1 0 1 0 0-2H9V3a1 1 0 0 0-1-1Z"
                  ></path>
                </svg>
                Create
              </button>
            </div>
          </div>
          {/*HAMBURGER*/}
          <div className="flex items-center">
            <LogoutIcon iconClasses={'w-6 h-6 stroke-iron'} />
          </div>
        </div>
      </div>
    </section>
  );
}
