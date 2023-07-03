import React, { useEffect, useState } from 'react';
import { EditIcon } from '@pages/popup/components/home/icons/icons';
import CopyButton from '@pages/popup/components/home/detail/buttons/CopyButton';

function EmailDomain({
  emailDomain,
  isEditing,
  onDomainChange,
  handleCopyClick
}: {
  emailDomain: string | null;
  isEditing: boolean;
  onDomainChange: (newDomain: string) => void;
  handleCopyClick: (textToCopy: string) => void;
}) {
  useEffect(() => {
    setEditedDomain(emailDomain);
  }, [emailDomain]);
  const domainLabelColor = emailDomain ? 'text-white' : 'text-gray-400';
  const [editedDomain, setEditedDomain] = useState(emailDomain);
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDomain(e.target.value);
    onDomainChange(e.target.value);
  };

  // This useEffect hook is responsible for updating the editedDomain state
  // whenever the emailDomain prop changes.
  useEffect(() => {
    setEditedDomain(emailDomain);
    // This condition checks if isEditing has changed from true to false.
    // If so, it resets the editedDomain state to the original emailDomain.
    // This ensures that when the user clicks the "Cancel" button, the editedDomain
    // is reset, and the previous changes are discarded.
    if (!isEditing) {
      setEditedDomain(emailDomain);
    }
  }, [emailDomain, isEditing]);
  const containerStyle = `inline-flex w-full border border-t-0 ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div className={'w-full truncate'}>
        <div
          className="ml-2 text-malibu font-normal text-detailLabel inline-flex"
          id="domainLabel"
        >
          domain
          {isEditing && (
            <EditIcon
              iconClasses={'w-[0.75rem] h-[0.75rem] ml-1 stroke-white mt-1'}
            />
          )}
        </div>
        <div
          className={`ml-2 mr-2 mb-1 font-normal text-detailValue ${domainLabelColor} truncate`}
        >
          {isEditing ? (
            <input
              className="bg-transparent text-white w-[98%] focus:outline-none truncate"
              type="text"
              value={editedDomain || ''}
              onChange={handleDomainChange}
            />
          ) : emailDomain ? (
            emailDomain
          ) : (
            'No domain set'
          )}
        </div>
      </div>
      {!isEditing && emailDomain && (
        <CopyButton onClick={handleCopyClick} textToCopy={emailDomain} />
      )}
    </div>
  );
}

export default EmailDomain;
