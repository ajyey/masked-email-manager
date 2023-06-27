import React from 'react';
import { DeletedIcon } from '@pages/popup/components/home/icons/icons';

interface LogoutConfirmationModalProps {
  closeModal: () => void;
  logout: () => void;
}

export default function LogoutConfirmationModal({
  closeModal,
  logout
}: LogoutConfirmationModalProps) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className=" rounded-lg shadow-lg relative flex flex-col w-full outline-none border-0 bg-white focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-center p-3 border-b border-solid border-gray-300 rounded-t">
              <DeletedIcon iconClasses={'w-5 h-5 mr-1 stroke-red-500'} />
              <div className="text-lg font-semibold">Logout</div>
            </div>
            {/*body*/}
            <div className="flex items-center justify-center">
              <p className="my-4 text-black text-sm">
                Are you sure you want to logout? You will need to re-enter your
                Fastmail API key to use this extension.
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-solid border-gray-300 rounded-b">
              <button
                className="bg-green-500 text-white font-bold uppercase text-sm px-3 py-2 rounded-lg shadow hover:shadow-xl hover:bg-red-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
              <button
                className="text-gray-500 background-transparent hover:bg-gray-200 hover:shadow-xl rounded-lg font-bold uppercase px-3 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
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
