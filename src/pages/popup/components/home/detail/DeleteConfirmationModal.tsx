import React from 'react';
import handleDelete from '@pages/popup/components/home/detail/EmailDetailPane';
import { MaskedEmail } from 'fastmail-masked-email';

interface DeleteConfirmationModalProps {
  closeModal: () => void;
  handleDelete: () => Promise<void>;
  selectedEmail: MaskedEmail | null;
}

export default function DeleteConfirmationModal({
  closeModal,
  handleDelete,
  selectedEmail
}: DeleteConfirmationModalProps) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-center p-2.5 border-b border-solid border-slate-200 rounded-t">
              <div className="text-lg font-semibold">
                {`Delete ${selectedEmail?.email}?`}
              </div>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={closeModal}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-1 flex items-center justify-center">
              <p className="my-4 text-slate-500 text-sm leading-relaxed">
                Are you sure you want to delete this email?
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="text-gray-500 background-transparent font-bold uppercase p-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
