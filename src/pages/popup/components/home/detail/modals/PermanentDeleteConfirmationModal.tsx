import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import { WarningIcon } from '@pages/popup/components/home/icons/icons';

interface PermanentDeleteConfirmationModalProps {
  closeModal: () => void;
  handlePermanentDelete: () => Promise<void>;
  selectedEmail: MaskedEmail | null;
}

export default function PermanentDeleteConfirmationModal({
  closeModal,
  handlePermanentDelete,
  selectedEmail
}: PermanentDeleteConfirmationModalProps) {
  return (
    <>
      <div
        id="defaultModal"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto md:inset-0"
      >
        <div className="relative w-full max-w-md">
          {/*Modal content*/}
          <div className="relative bg-big-stone rounded-lg shadow-sm">
            {/*Modal header*/}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <WarningIcon
                  iconClasses={'w-5 h-5 mr-2 stroke-red-500 stroke-2'}
                />
                <div className="text-lg font-semibold truncate">
                  Permanently Delete Email
                </div>
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
                onClick={closeModal}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/*Modal body*/}
            <div className="p-4 space-y-4">
              <div className="text-white text-sm">
                {`Are you sure you want to permanently delete `}
                <span className="font-semibold text-malibu">
                  {selectedEmail?.email}
                </span>
                ?
              </div>
            </div>
            {/*Modal footer*/}
            <div className="flex items-center justify-end p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white hover:bg-red-600 bg-red-700 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handlePermanentDelete}
              >
                Delete
              </button>
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-hidden focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
