import React from 'react';
import { FavoriteIcon } from '@pages/popup/components/home/icons/icons';

interface Props {
  isFavorited: boolean;
  onClick: () => Promise<void>;
}

const FavoriteButton: React.FC<Props> = ({ isFavorited, onClick }) => {
  const iconClasses = isFavorited
    ? 'w-4 h-4 mr-1 stroke-none fill-mikado-yellow'
    : 'w-4 h-4 mr-1 stroke-mikado-yellow fill-none';
  return (
    <button
      className="text-white focus:outline-hidden inline-flex font-medium rounded-lg text-sm px-2 py-1 items-center hover:bg-big-stone/[0.5]"
      onClick={onClick}
    >
      <FavoriteIcon iconClasses={iconClasses} />
      Favorite
    </button>
  );
};

export default FavoriteButton;
