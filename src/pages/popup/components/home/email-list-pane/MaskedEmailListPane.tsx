import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import MaskedEmailListItem from '@pages/popup/components/home/email-list-pane/MaskedEmailListItem';

interface Props {
  maskedEmails: MaskedEmail[];
}
function MaskedEmailListPane({ maskedEmails }: Props) {
  const maskedEmailItems = [];

  for (let i = 0; i < maskedEmails.length; i++) {
    maskedEmailItems.push(
      <MaskedEmailListItem maskedEmail={maskedEmails[i]} />
    );
  }

  return (
    <div className="h-[310px] overflow-y-auto overflow-x-hidden scrollbar pt-2 pb-2">
      <ul className="flex flex-col space-y-2 w-full">{maskedEmailItems}</ul>
    </div>
  );
}

export default MaskedEmailListPane;
