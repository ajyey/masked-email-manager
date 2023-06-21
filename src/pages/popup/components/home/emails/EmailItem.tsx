import React, { useMemo } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface MaskedEmailListItemProps {
  maskedEmail: MaskedEmail;
}

export default function EmailItem({ maskedEmail }: MaskedEmailListItemProps) {
  const truncatedEmail = useMemo(() => {
    const emailLength = maskedEmail.email.length;
    const maxLength = 28;

    if (emailLength > maxLength) {
      return maskedEmail.email.slice(0, maxLength - 3) + '...';
    } else {
      return maskedEmail.email;
    }
  }, [maskedEmail.email]);
  return (
    <div className="h-[50px] w-[95%] hover:bg-big-stone/[0.4] rounded-[5px] mx-auto m-auto">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col align-middle ml-2 mt-1">
          <div className="text-sm text-white font-bold">{truncatedEmail}</div>
          <div className="text-xs text-white">{maskedEmail.description}</div>
        </div>
      </div>
    </div>
  );
}
