import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';

interface Props {
  maskedEmails: MaskedEmail[];
}
function MaskedEmailListPane({ maskedEmails }: Props) {
  const emailItems = [];

  for (let i = 0; i < maskedEmails.length; i++) {
    emailItems.push(
      <li key={i} className="flex items-center space-x-2">
        {maskedEmails[i].email}
      </li>
    );
  }

  return <ul className="flex flex-col space-y-2">{emailItems}</ul>;
}

export default MaskedEmailListPane;
