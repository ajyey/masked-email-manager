import React from 'react';
import { FavoriteIcon } from '@pages/popup/components/home/icons/icons';
import handleFavoriteButtonClick from '@pages/popup/components/home/detail/EmailDetailPane';

interface CancelEditingButtonProps {
  onClick: () => void;
}

const CancelEditingButton: React.FC<CancelEditingButtonProps> = ({
  onClick
}: CancelEditingButtonProps) => {
  return (
    <button
      className="text-white focus:outline-none inline-flex font-medium rounded-lg text-sm px-2 py-1 items-center ml-1 mr-1 bg-gray-500"
      onClick={onClick}
    >
      Cancel
    </button>
  );
};

export default CancelEditingButton;
