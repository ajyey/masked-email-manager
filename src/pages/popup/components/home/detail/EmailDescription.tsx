import React, { useEffect, useState } from 'react';
import { EditIcon } from '@pages/popup/components/home/icons/icons';
import CopyButton from '@pages/popup/components/home/detail/CopyButton';

function EmailDescription({
  emailDescription,
  isEditing,
  onDescriptionChange,
  handleCopyClick
}: {
  emailDescription: string | null;
  isEditing: boolean;
  onDescriptionChange: (newDescription: string) => void;
  handleCopyClick: (textToCopy: string) => void;
}) {
  const [editedDescription, setEditedDescription] = useState(emailDescription);
  useEffect(() => {
    setEditedDescription(emailDescription);
  }, [emailDescription]);

  const handlDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  // This useEffect hook is responsible for updating the editedDescription state
  // whenever the emailDescription prop changes.
  useEffect(() => {
    setEditedDescription(emailDescription);
    // This condition checks if isEditing has changed from true to false.
    // If so, it resets the editedDescription state to the original emailDescription.
    // This ensures that when the user clicks the "Cancel" button, the editedDescription
    // is reset, and the previous changes are discarded.
    if (!isEditing) {
      setEditedDescription(emailDescription);
    }
  }, [emailDescription, isEditing]);
  const descriptionLabelColor = emailDescription
    ? 'text-white'
    : 'text-gray-400';
  // Use different styles based on whether we're editing or not
  const containerStyle = `inline-flex w-full border border-t-0 ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div className="flex flex-grow">
        <div className="w-full">
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
            className={`ml-2 mb-1 font-normal text-detailValue ${descriptionLabelColor} break-all`}
          >
            {isEditing ? (
              <input
                className="bg-transparent text-white w-[98%] focus:outline-none"
                type="text"
                value={editedDescription || ''}
                maxLength={127}
                onChange={handlDescriptionChange}
              />
            ) : emailDescription ? (
              emailDescription
            ) : (
              'No description set'
            )}
          </div>
        </div>
      </div>
      {!isEditing && emailDescription && (
        <div className="flex items-center align-middle ml-auto">
          <CopyButton onClick={handleCopyClick} textToCopy={emailDescription} />
        </div>
      )}
    </div>
  );
}

export default EmailDescription;
