import React, { useMemo } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface MaskedEmailListItemProps {
  maskedEmail: MaskedEmail;
  onClick: (id: string) => void;
  isSelected: boolean;
}

export default function EmailItem({
  maskedEmail,
  onClick,
  isSelected
}: MaskedEmailListItemProps) {
  const handleClick = () => {
    onClick(maskedEmail.id);
  };

  const truncatedEmail = useMemo(() => {
    const emailLength = maskedEmail.email.length;
    const maxLength = 28;

    if (emailLength > maxLength) {
      return maskedEmail.email.slice(0, maxLength - 3) + '...';
    } else {
      return maskedEmail.email;
    }
  }, [maskedEmail.email]);
  const truncatedDescription = useMemo(() => {
    const descriptionLength = maskedEmail.description.length;
    const maxLength = 36;

    if (descriptionLength > maxLength) {
      return maskedEmail.description.slice(0, maxLength - 3) + '...';
    } else {
      return maskedEmail.description;
    }
  }, [maskedEmail.description]);

  // If the email item is currently selected, use the french-blue background color.
  const backgroundStyle = isSelected
    ? 'bg-french-blue'
    : 'hover:bg-big-stone/[0.4]';
  return (
    <div
      className={`h-[50px] w-[95%] rounded-[5px] mx-auto m-auto ${backgroundStyle}`}
      onClick={handleClick}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col align-middle ml-2 mt-1">
          <div className="text-sm text-white font-bold">{truncatedEmail}</div>
          <div className="text-xs text-white">{truncatedDescription}</div>
        </div>
      </div>
    </div>
  );
}
