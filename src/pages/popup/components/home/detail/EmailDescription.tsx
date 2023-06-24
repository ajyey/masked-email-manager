import React, { useEffect, useState } from 'react';
import { EditIcon } from '@pages/popup/components/home/icons/icons';

function EmailDescription({
  emailDescription,
  isEditing
}: {
  emailDescription: string | null;
  isEditing: boolean;
}) {
  const [editedDescription, setEditedDescription] = useState(emailDescription);
  useEffect(() => {
    setEditedDescription(emailDescription);
  }, [emailDescription]);
  const handlDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDescription(e.target.value);
  };
  const descriptionExists =
    emailDescription !== null && emailDescription !== '';
  const descriptionLabelColor = descriptionExists
    ? 'text-white'
    : 'text-gray-400';
  // Use different styles based on whether we're editing or not
  const containerStyle = `border border-t-0 ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="pt-1 ml-2 text-malibu font-normal text-detailLabel inline-flex"
          id="emailDescriptionLabel"
        >
          description
          {isEditing && (
            <EditIcon
              iconClasses={'w-[0.75rem] h-[0.75rem] ml-1 stroke-white mt-1'}
            />
          )}
        </div>
        <div
          className={`ml-2 mb-1 font-normal text-detailValue ${descriptionLabelColor}`}
        >
          {isEditing ? (
            <input
              className="bg-transparent text-white w-[98%] focus:outline-none"
              type="text"
              value={editedDescription || ''}
              onChange={handlDescriptionChange}
            />
          ) : descriptionExists ? (
            emailDescription
          ) : (
            'No description set'
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailDescription;
