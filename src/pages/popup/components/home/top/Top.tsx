import React from 'react';
import icon from '@assets/img/icon.svg';

export default function TopComponent() {
  return (
    <section className="flex h-[55px] items-center">
      <div className="w-full border-b border-b-big-stone">
        <div className="flex">
          {/*LOGO*/}
          <div className="flex columns-[45px] items-center">
            <img
              src={icon}
              className="pointer-events-none h-[30px] w-[45px] ml-1.5 mr-1 mb-1"
              alt="icon"
            />
          </div>
          {/*SEARCH BAR*/}
          <div className="columns-[375px]">
            <div className="relative w-full items-center p-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-big-stone text-gray-900 text-sm rounded-[5px] w-full pl-10 h-[35px] items-center p-2.5"
                placeholder="Search Masked Emails..."
                required
              ></input>
            </div>
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
