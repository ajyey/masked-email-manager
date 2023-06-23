import { useEffect, useState } from 'react';

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
  const containerStyle = `border border-t-0 border-big-stone ${
    isEditing ? 'bg-big-stone' : 'bg-astronaut hover:bg-french-blue/[0.4]'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="pt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailDescriptionLabel"
        >
          description
        </div>
        <div
          className={`ml-2 mb-1 font-normal text-detailValue ${descriptionLabelColor}`}
        >
          {isEditing ? (
            <input
              className="bg-transparent text-white w-full"
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
