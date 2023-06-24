import React, { useEffect, useState } from 'react';
import emailDescription from '@pages/popup/components/home/detail/EmailDescription';
import { EditIcon } from '@pages/popup/components/home/icons/icons';

function EmailDomain({
  emailDomain,
  isEditing,
  onDomainChange
}: {
  emailDomain: string | null;
  isEditing: boolean;
  onDomainChange: (newDomain: string) => void;
}) {
  useEffect(() => {
    setEditedDomain(emailDomain);
  }, [emailDomain]);
  const domainExists = emailDomain !== null && emailDomain !== '';
  const domainLabelColor = domainExists ? 'text-white' : 'text-gray-400';
  const [editedDomain, setEditedDomain] = useState(emailDomain);
  const editingStyle = isEditing ? 'bg-transparent text-white' : '';
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDomain(e.target.value);
    onDomainChange(e.target.value);
  };
  const containerStyle = `border border-t-0 ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
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
          className={`ml-2 mr-2 mb-1 font-normal text-detailValue ${domainLabelColor}`}
        >
          {isEditing ? (
            <input
              className="bg-transparent text-white w-[98%] focus:outline-none"
              type="text"
              value={editedDomain || ''}
              onChange={handleDomainChange}
            />
          ) : domainExists ? (
            emailDomain
          ) : (
            'No domain set'
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailDomain;
