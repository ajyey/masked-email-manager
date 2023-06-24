import React, { useEffect, useState } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import EmailItem from '@pages/popup/components/home/emails/EmailItem';
import Fuse from 'fuse.js';
import { getFavoriteEmailIds } from '../../../../../../utils/storageUtil';

function isFuseResult(obj: object): obj is Fuse.FuseResult<MaskedEmail> {
  return 'item' in obj;
}
interface Props {
  maskedEmails: MaskedEmail[];
  filter: string;
  searchQuery: string;
  onFilteredEmailsCountChange: (count: number) => void;
  setSelectedEmail: (email: MaskedEmail | null) => void;
  selectedEmail: MaskedEmail | null;
}
function EmailList({
  maskedEmails,
  filter,
  searchQuery,
  onFilteredEmailsCountChange,
  setSelectedEmail,
  selectedEmail
}: Props) {
  // Keep track of the filtered emails
  const [filteredEmails, setFilteredEmails] = useState<MaskedEmail[]>([]);
  // Filter the emails based on the filter prop
  useEffect(() => {
    const applyFilter = async () => {
      let newFilteredEmails = maskedEmails;
      if (filter !== 'all' && filter !== 'favorited') {
        newFilteredEmails = maskedEmails.filter(
          (email: MaskedEmail) => email.state === filter
        );
      }
      if (filter === 'favorited') {
        const favoritedEmails = await getFavoriteEmailIds();
        newFilteredEmails = maskedEmails.filter((email: MaskedEmail) =>
          favoritedEmails.includes(email.id)
        );
      }
      setFilteredEmails(newFilteredEmails);
    };
    applyFilter();
  }, [filter, filteredEmails]);

  // Use Fuse.js to perform the fuzzy search
  const fuse: Fuse<MaskedEmail> = new Fuse(filteredEmails, {
    keys: ['email', 'description', 'id', 'forDomain'],
    threshold: 0.3,
    useExtendedSearch: true
  });
  const searchResults = searchQuery ? fuse.search(searchQuery) : filteredEmails;
  const handleEmailItemClick = (email: MaskedEmail) => {
    setSelectedEmail(email);
  };

  useEffect(() => {
    // Check if the currently selectedEmail is present in the searchResults list.
    const isSelectedEmailInResults = searchResults.some((result) => {
      const email = isFuseResult(result) ? result.item : result;

      // Return true if the email ID matches the selectedEmail's ID.
      return email.id === selectedEmail?.id;
    });

    // Select the first email in the list by default if:
    // 1. No email is currently selected (selectedEmail is null or undefined).
    // 2. The selectedEmail is not present in the searchResults list (isSelectedEmailInResults is false).
    if (
      searchResults.length > 0 &&
      (!selectedEmail || !isSelectedEmailInResults)
    ) {
      const firstEmail = isFuseResult(searchResults[0])
        ? searchResults[0].item
        : searchResults[0];

      setSelectedEmail(firstEmail);
    } else if (searchResults.length === 0) {
      setSelectedEmail(null);
    }

    // Call the onFilteredEmailsCountChange callback with the searchResults length.
    // This can be used by the parent component to update the count of filtered emails.
    onFilteredEmailsCountChange(searchResults.length);
  }, [searchResults, onFilteredEmailsCountChange]);

  return (
    <div className="h-[310px] overflow-y-auto overflow-x-hidden scrollbar pt-2 pb-2">
      <ul className="flex flex-col space-y-2 w-full">
        {searchResults.map((result) => {
          const maskedEmail: MaskedEmail = isFuseResult(result)
            ? result.item
            : result;
          return (
            <EmailItem
              key={maskedEmail.id}
              maskedEmail={maskedEmail}
              onClick={handleEmailItemClick}
              isSelected={
                selectedEmail ? maskedEmail.id === selectedEmail.id : false
              }
            />
          );
        })}
      </ul>
    </div>
  );
}

export default EmailList;
