import React from 'react';
import { MaskedEmailState } from 'fastmail-masked-email';
import {
  StateDeletedIcon,
  StateDisabledIcon,
  StateEnabledIcon
} from '@pages/popup/components/home/detail/StateIcons';

interface EmailStateToggleProps {
  emailState: MaskedEmailState | undefined;
  onEmailStateChange: (newState: MaskedEmailState) => void;
}

const EmailStateToggle: React.FC<EmailStateToggleProps> = ({
  emailState,
  onEmailStateChange
}: EmailStateToggleProps) => {
  const isChecked = emailState === 'enabled';
  const isDeleted = emailState === 'deleted';

  return (
    <div className={'inline-flex'}>
      <label
        htmlFor="AcceptConditions"
        className="relative h-6 w-12 cursor-pointer"
      >
        <input
          type="checkbox"
          id="AcceptConditions"
          checked={isChecked}
          onChange={() =>
            onEmailStateChange(isChecked ? 'disabled' : 'enabled')
          }
          className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
        />
        <span className="absolute inset-y-0 start-0 z-10 m-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full  bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
          {isDeleted ? (
            <StateDeletedIcon iconClasses={'w-4 h-4 stroke-2 stroke-red-500'} />
          ) : isChecked ? (
            <StateEnabledIcon iconClasses={'h-4 w-4'} />
          ) : (
            <StateDisabledIcon iconClasses={'w-4 h-4 stroke-2'} />
          )}
        </span>
        <span
          className={`absolute inset-0 rounded-full transition ${
            isDeleted ? 'bg-red-500' : 'bg-gray-300 peer-checked:bg-green-500'
          }`}
        ></span>
      </label>
    </div>
  );
};

export default EmailStateToggle;
