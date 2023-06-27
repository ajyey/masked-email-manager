import React from 'react';
import {
  DeletedIcon,
  EditIcon
} from '@pages/popup/components/home/icons/icons';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick
}: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-white inline-flex focus:outline-none font-medium rounded-lg text-sm px-2 py-1 items-center ml-1 mr-1 hover:bg-big-stone/[0.5]"
    >
      <DeletedIcon iconClasses={'w-4 h-4 mr-1 stroke-red-500'} />
      Delete
    </button>
  );
};

export default DeleteButton;
