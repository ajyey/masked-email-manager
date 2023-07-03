import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface MaskedEmailListItemProps {
  maskedEmail: MaskedEmail;
  onClick: (email: MaskedEmail) => void;
  isSelected: boolean;
}

const EmailItem = React.forwardRef<HTMLDivElement, MaskedEmailListItemProps>(
  ({ maskedEmail, onClick, isSelected }, ref) => {
    const handleClick = () => {
      onClick(maskedEmail);
    };

    // If the email item is currently selected, use the french-blue background color.
    const backgroundStyle = isSelected
      ? 'bg-french-blue'
      : 'hover:bg-big-stone/[0.4]';

    // Determine the color of the status circle based on the email status.
    let statusColor: string;
    switch (maskedEmail.state) {
      case 'disabled':
        statusColor = 'bg-gray-400';
        break;
      case 'enabled':
        statusColor = 'bg-green-400';
        break;
      default:
        statusColor = 'bg-red-400';
    }

    return (
      <div
        ref={ref}
        className={`h-[50px] w-[230px] m-1 rounded-[5px] ${backgroundStyle}`}
        onClick={handleClick}
      >
        <div className="flex flex-row justify-between p-1.5">
          <div className="flex flex-col align-middle truncate">
            <div className="text-sm text-white font-bold truncate">
              {maskedEmail.email}
            </div>
            <div className="text-xs text-white truncate">
              {maskedEmail.description}
            </div>
          </div>
          <div className={`flex flex-col`}>
            <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
          </div>
        </div>
      </div>
    );
  }
);
EmailItem.displayName = 'EmailItem';
export default EmailItem;
