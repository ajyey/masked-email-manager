import React from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import EmailItem from '@pages/popup/components/home/email-list-pane/EmailItem';
import Fuse from 'fuse.js';

function isFuseResult(obj: any): obj is Fuse.FuseResult<MaskedEmail> {
  return 'item' in obj;
}
interface Props {
  maskedEmails: MaskedEmail[];
  filter: string;
  searchQuery: string;
}
function EmailList({ maskedEmails, filter, searchQuery }: Props) {
  let filteredEmails = maskedEmails;
  if (filter !== 'all') {
    filteredEmails = maskedEmails.filter(
      (email: MaskedEmail) => email.state === filter
    );
  }
  // Use Fuse.js to perform the fuzzy search
  const fuse: Fuse<MaskedEmail> = new Fuse(filteredEmails, {
    keys: ['email', 'description', 'id', 'forDomain'],
    threshold: 0.3,
    useExtendedSearch: true
  });
  const searchResults = searchQuery ? fuse.search(searchQuery) : filteredEmails;
  return (
    <div className="h-[310px] overflow-y-auto overflow-x-hidden scrollbar pt-2 pb-2">
      <ul className="flex flex-col space-y-2 w-full">
        {searchResults.map((result) => {
          const maskedEmail: MaskedEmail = isFuseResult(result)
            ? result.item
            : result;
          return <EmailItem key={maskedEmail.id} maskedEmail={maskedEmail} />;
        })}
      </ul>
    </div>
  );
}

export default EmailList;
