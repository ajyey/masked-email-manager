import React from 'react';
import icon from '@assets/img/icon.svg';
import SearchBar from '@pages/popup/components/home/top/SearchBar';

interface Props {
  onSearchChange: (searchQuery: string) => void;
}

export default function TopComponent({ onSearchChange }: Props) {
  return (
    <section className="flex h-[55px] items-center border-b border-b-big-stone">
      <div className="w-full">
        <div className="flex">
          {/*LOGO*/}
          <div className="flex columns-[45px] items-center">
            <a
              href="https://github.com/ajyey/masked-email-manager"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={icon}
                className="pointer-events-none h-[30px] w-[45px] ml-1.5 mr-1 mb-1"
                alt="icon"
              />
            </a>
          </div>
          {/*SEARCH BAR*/}
          <div className="columns-[375px]">
            <SearchBar onSearchChange={onSearchChange} />
          </div>
          {/*NEW EMAIL BUTTON*/}
          <div className="flex columns-[120px] items-center">
            <div className="relative w-full p-1 mb-1">
              <button
                type="button"
                className="text-white bg-french-blue font-bold rounded-[5px] text-sm p-2.5 h-[35px] text-center inline-flex items-center"
              >
                <svg
                  width="16"
                  height="16"
                  data-path-count="1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 text-white fill-current"
                >
                  <path
                    data-path-style="onLight"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 2a1 1 0 0 0-1 1v4H3a1 1 0 0 0 0 2h4v4a1 1 0 1 0 2 0V9h4a1 1 0 1 0 0-2H9V3a1 1 0 0 0-1-1Z"
                  ></path>
                </svg>
                New Email
              </button>
            </div>
          </div>
          {/*HAMBURGER*/}
          <div className="flex h-[35px] items-center ml-1.5 mt-1">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25"
                stroke="#D8D9D8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
