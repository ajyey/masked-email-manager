import React from 'react';
import { WarningIcon } from '@pages/popup/components/home/icons/icons';

interface PermanentlyDeleteButtonProps {
  onClick: () => void;
}

const PermanentlyDeleteButton: React.FC<PermanentlyDeleteButtonProps> = ({
  onClick
}) => {
  return (
    <div className="inline-flex items-center justify-center mt-2">
      <button
        onClick={onClick}
        className="text-white text-sm px-3 py-1 rounded hover:bg-red-500 bg-red-600/[0.75] focus:outline-none focus:ring-4 focus:ring-blue-3 inline-flex items-center"
      >
        <WarningIcon iconClasses="w-4 h-4 mr-2 stroke-white stroke-2" />
        Permanently Delete
      </button>
    </div>
  );
};

export default PermanentlyDeleteButton;
