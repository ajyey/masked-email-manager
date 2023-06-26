import React, { useMemo } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface MaskedEmailListItemProps {
  maskedEmail: MaskedEmail;
  onClick: (email: MaskedEmail) => void;
  isSelected: boolean;
}

export default function EmailItem({
  maskedEmail,
  onClick,
  isSelected
}: MaskedEmailListItemProps) {
  const handleClick = () => {
    onClick(maskedEmail);
  };

  // If the email item is currently selected, use the french-blue background color.
  const backgroundStyle = isSelected
    ? 'bg-french-blue'
    : 'hover:bg-big-stone/[0.4]';
  return (
    <div
      className={`h-[50px] w-[230px] m-1 rounded-[5px] ${backgroundStyle}`}
      onClick={handleClick}
    >
      <div className="flex flex-row justify-between p-1.5">
        <div className="flex flex-col align-middle truncate">
          <div className="text-sm text-white font-bold truncate">
            {maskedEmail.email}
          </div>
          <div className="text-xs text-white truncate">
            {maskedEmail.description}
          </div>
        </div>
      </div>
    </div>
  );
}
