import React from 'react';
import { DeletedIcon } from '@pages/popup/components/home/icons/icons';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled
}: DeleteButtonProps) => {
  const baseClasses =
    'text-white inline-flex focus:outline-none font-medium rounded-lg text-sm px-2 py-1 items-center';
  const enabledClasses = 'hover:bg-big-stone/[0.5]';
  const disabledClasses = 'bg-big-stone/[0.3] cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${
        disabled ? disabledClasses : enabledClasses
      }`}
    >
      <DeletedIcon
        iconClasses={
          'w-4 h-4 mr-1' + (disabled ? ' stroke-gray-500' : ' stroke-red-500')
        }
      />
      Delete
    </button>
  );
};

export default DeleteButton;
