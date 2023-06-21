import React, { useEffect } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import EmailItem from '@pages/popup/components/home/emails/EmailItem';
import Fuse from 'fuse.js';

function isFuseResult(obj: object): obj is Fuse.FuseResult<MaskedEmail> {
  return 'item' in obj;
}
interface Props {
  maskedEmails: MaskedEmail[];
  filter: string;
  searchQuery: string;
  // callback prop to receive the count of filtered emails
  onFilteredEmailsCountChange: (count: number) => void;
}
function EmailList({
  maskedEmails,
  filter,
  searchQuery,
  onFilteredEmailsCountChange
}: Props) {
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

  useEffect(() => {
    // Call the onFilteredEmailsCountChange callback with the searchResults length
    onFilteredEmailsCountChange(searchResults.length);
  }, [searchResults, onFilteredEmailsCountChange]);

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
