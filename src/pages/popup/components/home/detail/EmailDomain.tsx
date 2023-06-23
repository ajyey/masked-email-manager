import { useEffect, useState } from 'react';
import emailDescription from '@pages/popup/components/home/detail/EmailDescription';

function EmailDomain({
  emailDomain,
  isEditing
}: {
  emailDomain: string | null;
  isEditing: boolean;
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
  };
  const containerStyle = `border border-big-stone border-t-0 ${
    isEditing ? 'bg-big-stone' : 'bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="ml-2 text-malibu font-normal text-detailLabel"
          id="domainLabel"
        >
          domain
        </div>
        <div
          className={`ml-2 mr-2 mb-1 font-normal text-detailValue ${domainLabelColor}`}
        >
          {isEditing ? (
            <input
              className="bg-transparent text-white w-full"
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
