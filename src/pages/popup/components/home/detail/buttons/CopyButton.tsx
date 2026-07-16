import React from 'react';
import { CopyIcon } from '@pages/popup/components/home/icons/icons';

interface CopyButtonProps {
  onClick: (textToCopy: string) => void;
  textToCopy: string | null;
  label: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  textToCopy,
  label
}: CopyButtonProps) => {
  return (
    <div className="flex items-center align-middle ml-auto">
      <button
        type="button"
        className="focus:outline-hidden inline-flex"
        aria-label={label}
        disabled={!textToCopy}
        onClick={(e) => {
          e.stopPropagation();
          if (textToCopy) {
            onClick(textToCopy);
          }
        }}
      >
        <CopyIcon iconClasses={'w-6 h-6 mr-2 stroke-iron'} />
      </button>
    </div>
  );
};

export default CopyButton;
