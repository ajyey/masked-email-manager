import React from 'react';
import { MaskedEmailState } from 'fastmail-masked-email';
import {
  StateDisabledIcon,
  StateEnabledIcon
} from '@pages/popup/components/home/detail/StateIcons';

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
        <span className="absolute inset-y-0 start-0 z-10 m-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full  bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
          <StateDisabledIcon iconClasses={'w-4 h-4 stroke-2'} />
          <StateEnabledIcon iconClasses={'hidden h-4 w-4'} />
        </span>
        <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
      </label>
    </div>
  );
};

export default EmailStateToggle;
