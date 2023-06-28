import React from 'react';
import { EditIcon } from '@pages/popup/components/home/icons/icons';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick
}: EditButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-white inline-flex focus:outline-none font-medium rounded-lg text-sm px-2 py-1 items-center hover:bg-big-stone/[0.5]"
    >
      <EditIcon iconClasses={'w-4 h-4 mr-1'} />
      Edit
    </button>
  );
};

export default EditButton;
