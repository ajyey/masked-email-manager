import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface MaskedEmailListItemProps {
  maskedEmail: MaskedEmail;
  onClick: (email: MaskedEmail) => void;
  isSelected: boolean;
}

const EmailItem = React.forwardRef<HTMLLIElement, MaskedEmailListItemProps>(
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

    const openInFastmail = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the parent onClick
      const fastmailUrl = `https://app.fastmail.com/settings/masked/${maskedEmail.id}`;
      window.open(fastmailUrl, '_blank');
    };

    return (
      <li
        ref={ref}
        data-testid={`email-row-${maskedEmail.id}`}
        className={`relative h-[50px] w-[230px] m-1 rounded-[5px] ${backgroundStyle}`}
      >
        <button
          type="button"
          role="option"
          aria-selected={isSelected}
          aria-label={`${maskedEmail.email}, ${maskedEmail.state}`}
          className="flex flex-row justify-between p-1.5 h-full w-full text-left focus:outline-hidden"
          onClick={handleClick}
        >
          <div className="flex flex-col align-middle truncate pr-5">
            <span className="text-sm text-white font-bold truncate">
              {maskedEmail.email}
            </span>
            <span className="text-xs text-white truncate">
              {maskedEmail.description}
            </span>
          </div>
          <div className="flex ml-1">
            <div
              className={`w-2 h-2 rounded-full ${statusColor}`}
              aria-hidden="true"
            ></div>
            <span className="sr-only">{maskedEmail.state}</span>
          </div>
        </button>
        <button
          type="button"
          onClick={openInFastmail}
          className="absolute right-1 bottom-1 text-white focus:outline-hidden p-0.5 rounded-full hover:bg-french-blue/[0.6] transition-colors duration-200"
          title="Open in Fastmail"
          aria-label={`Open ${maskedEmail.email} in Fastmail`}
        >
          <ExternalLinkIcon iconClasses="w-3 h-3 stroke-iron hover:stroke-white transition-colors duration-200" />
        </button>
      </li>
    );
  }
);

// External Link Icon component
const ExternalLinkIcon: React.FC<{ iconClasses: string }> = ({
  iconClasses
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={iconClasses}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
};

EmailItem.displayName = 'EmailItem';
export default EmailItem;
