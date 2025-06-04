import React, { useState } from 'react';
import SearchBar from '@pages/popup/components/home/top/SearchBar';
import SettingsDropdown from '@pages/popup/components/home/top/SettingsDropdown';
import { MaskedEmail } from 'fastmail-masked-email';
import icon from '@assets/img/icon.svg';

interface Props {
  onSearchChange: (searchQuery: string) => void;
  onRefresh: () => Promise<void>;
  onLogout: () => void;
  addNewEmailToEmailList: (newEmail: MaskedEmail) => void;
  setSelectedEmail: (
    value:
      | ((prevState: MaskedEmail | null) => MaskedEmail | null)
      | MaskedEmail
      | null
  ) => void;
  activeTabUrl: string;
  openLogoutConfirmationModal: () => void;
  closeLogoutConfirmationModal: () => void;
  openCreateEmailModal: () => void;
  closeCreateEmailModal: () => void;
}

export default function TopComponent({
  onSearchChange,
  onRefresh,
  openLogoutConfirmationModal,
  openCreateEmailModal
}: Props) {
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <section className="flex h-[55px] items-center border-b border-b-big-stone w-full">
      <div className="flex items-center mr-1">
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
      <div className="w-96 h-[30px] mr-2">
        <SearchBar onSearchChange={onSearchChange} />
      </div>
      {/*REFRESH BUTTON*/}
      <div className="flex items-center justify-center mr-2">
        <button
          type="button"
          className="text-white focus:outline-hidden"
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
        <div className="relative">
          <button
            type="button"
            className="text-white bg-french-blue font-semibold rounded-[5px] text-sm p-2 h-[30px] text-center inline-flex items-center justify-center"
            onClick={openCreateEmailModal}
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
      <div className="flex items-center ml-1">
        <SettingsDropdown openLogoutModal={openLogoutConfirmationModal} />
      </div>
    </section>
  );
}
