import React, { useState } from 'react';
import { create, MaskedEmail, Session } from 'fastmail-masked-email';
import { toast } from 'react-hot-toast';
import { getFastmailSession } from '../../../../../../../utils/storageUtil';
import {
  FILTER_OPTIONS,
  FilterOption
} from '@pages/popup/components/home/filter/FilterOption';

interface CreateEmailModalProps {
  closeModal: () => void;
  activeTabUrl: string;
  setSelectedEmail: (email: MaskedEmail | null) => void;
  addNewEmailToEmailList: (newEmail: MaskedEmail) => void;
  setFilterOption: (
    value: ((prevState: FilterOption) => FilterOption) | FilterOption
  ) => void;
}

export default function CreateEmailModal({
  closeModal,
  activeTabUrl,
  setSelectedEmail,
  addNewEmailToEmailList,
  setFilterOption
}: CreateEmailModalProps) {
  const [domain, setDomain] = useState(activeTabUrl);
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    const session: Session = await getFastmailSession();
    try {
      const newEmail = await create(session, {
        forDomain: domain,
        description: description,
        state: 'enabled'
      });
      // The API response from Fastmail for some reason doesnt return a newly created email's forDomain and description... haha
      const newEmailWithDomainAndDescription = {
        ...newEmail,
        description: description,
        forDomain: domain
      };
      if (!newEmail.email) {
        toast.error('An error occurred while creating your email!', {
          duration: 2000,
          position: 'bottom-center',
          style: {
            backgroundColor: 'red', // big-stone
            color: '#FFFFFF' // white
          }
        });
      }
      closeModal();
      setFilterOption(FILTER_OPTIONS.Enabled);
      await navigator.clipboard.writeText(newEmail.email);
      addNewEmailToEmailList(newEmailWithDomainAndDescription);
      setSelectedEmail(newEmailWithDomainAndDescription);
      toast.success(
        `New email ${newEmail.email} created and copied to clipboard!`,
        {
          duration: 3000,
          position: 'bottom-center',
          style: {
            backgroundColor: '#333E48', // big-stone
            color: '#FFFFFF' // white
          }
        }
      );
    } catch (error) {
      console.error('Error creating new email:', error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto md:inset-0">
        <div className="relative w-full max-w-md">
          {/*Modal content*/}
          <div className="relative bg-big-stone rounded-lg shadow">
            {/*Modal header*/}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create Email
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
            <div className="p-3 space-y-4">
              <input
                type="text"
                className="w-full px-3 py-2 text-white text-sm bg-gray-600 rounded-md focus:bg-gray-500 outline-none"
                placeholder="Domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <textarea
                className="w-full px-3 py-2 text-white text-sm bg-gray-600 rounded-md focus:bg-gray-500 outline-none resize-none"
                placeholder="Description"
                maxLength={127}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/*Modal footer*/}
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                className="text-white hover:bg-french-blue bg-french-blue/[0.75] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleCreate}
              >
                Create
              </button>
              <button
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
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
