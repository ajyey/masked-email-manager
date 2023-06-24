import React from 'react';
import { EditIcon } from '@pages/popup/components/home/icons/icons';
import handleFavoriteButtonClick from '@pages/popup/components/home/detail/EmailDetailPane';

interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick
}: SaveButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-white inline-flex focus:outline-none font-medium rounded-lg text-sm px-2 py-1 items-center ml-1 mr-1 hover:bg-big-stone/[0.5]"
    >
      {/*<EditIcon iconClasses={'w-4 h-4 mr-1'} />*/}
      Save
    </button>
  );
};

export default SaveButton;