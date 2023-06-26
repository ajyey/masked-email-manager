import CopyButton from '@pages/popup/components/home/detail/CopyButton';
import React from 'react';

function EmailAddress({
  emailAddress,
  isEditing,
  handleCopyClick
}: {
  emailAddress: string | null;
  isEditing: boolean;
  handleCopyClick: (textToCopy: string) => void;
}) {
  const containerStyle = `inline-flex w-full border rounded-b-none rounded rounded-tl-lg rounded-tr-lg hover:bg-french-blue/[0.4] ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut'
  }`;
  return (
    <div className={containerStyle}>
      <div className={'truncate'}>
        <div
          className="mt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailLabel"
        >
          email
        </div>
        <div className="ml-2 mb-1 font-normal text-white text-detailValue truncate">
          {emailAddress}
        </div>
      </div>
      <CopyButton onClick={handleCopyClick} textToCopy={emailAddress} />
    </div>
  );
}

export default EmailAddress;
