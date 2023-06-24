import CopyButton from '@pages/popup/components/home/detail/CopyButton';
import React from 'react';

function EmailId({
  emailId,
  isEditing,
  handleCopyClick
}: {
  emailId: string | null;
  isEditing: boolean;
  handleCopyClick: (textToCopy: string) => void;
}) {
  const containerStyle = `inline-flex w-full border border-t-0 rounded-b-lg hover:bg-french-blue/[0.4] ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="pt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailDescriptionLabel"
        >
          ID
        </div>
        <div className="ml-2 mb-1 font-normal text-white text-detailValue">
          {emailId}
        </div>
      </div>
      {!isEditing && (
        <CopyButton onClick={handleCopyClick} textToCopy={emailId} />
      )}
    </div>
  );
}

export default EmailId;
