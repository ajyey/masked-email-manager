import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import MaskedEmailListItem from '@pages/popup/components/home/email-list-pane/MaskedEmailListItem';

interface Props {
  maskedEmails: MaskedEmail[];
  filter: string;
}
function MaskedEmailListPane({ maskedEmails, filter }: Props) {
  let filteredEmails = maskedEmails;
  if (filter !== 'all') {
    filteredEmails = maskedEmails.filter((email) => email.state === filter);
  }
  return (
    <div className="h-[310px] overflow-y-auto overflow-x-hidden scrollbar pt-2 pb-2">
      <ul className="flex flex-col space-y-2 w-full">
        {filteredEmails.map((maskedEmail) => (
          <MaskedEmailListItem
            key={maskedEmail.email}
            maskedEmail={maskedEmail}
          />
        ))}
      </ul>
    </div>
  );
}

export default MaskedEmailListPane;
