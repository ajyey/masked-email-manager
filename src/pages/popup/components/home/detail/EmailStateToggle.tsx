import React from 'react';
import { MaskedEmailState } from 'fastmail-masked-email';

interface EmailStateToggleProps {
  emailState: MaskedEmailState | undefined;
}

const EmailStateToggle: React.FC<EmailStateToggleProps> = ({
  emailState
}: EmailStateToggleProps) => {
  return (
    <div className={'inline-flex mr-auto ml-4'}>
      {' '}
      <label
        htmlFor="AcceptConditions"
        className="relative h-6 w-12 cursor-pointer"
      >
        {' '}
        <input
          type="checkbox"
          id="AcceptConditions"
          className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
        />
        <span className="absolute inset-y-0 start-0 z-10 m-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
          <svg
            data-unchecked-icon
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            strokeWidth={2}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 stroke-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
            />
          </svg>
          <svg
            data-checked-icon
            xmlns="http://www.w3.org/2000/svg"
            className="hidden h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
      </label>
    </div>
  );
};

export default EmailStateToggle;
