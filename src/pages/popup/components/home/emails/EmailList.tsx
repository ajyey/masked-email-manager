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
  setSelectedEmailId: (
    value: ((prevState: string | null) => string | null) | string | null
  ) => void;
  selectedEmailId: string | null;
}
function EmailList({
  maskedEmails,
  filter,
  searchQuery,
  onFilteredEmailsCountChange,
  setSelectedEmailId,
  selectedEmailId
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
  }, [maskedEmails, filter]);

  // Use Fuse.js to perform the fuzzy search
  const fuse: Fuse<MaskedEmail> = new Fuse(filteredEmails, {
    keys: ['email', 'description', 'id', 'forDomain'],
    threshold: 0.3,
    useExtendedSearch: true
  });
  const searchResults = searchQuery ? fuse.search(searchQuery) : filteredEmails;
  const handleEmailItemClick = (id: string) => {
    setSelectedEmailId(id);
  };

  useEffect(() => {
    // Select the first email in the list by default
    if (searchResults.length > 0) {
      const firstEmailId = isFuseResult(searchResults[0])
        ? searchResults[0].item.id
        : searchResults[0].id;
      setSelectedEmailId(firstEmailId);
    } else {
      setSelectedEmailId(null);
    }
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
          return (
            <EmailItem
              key={maskedEmail.id}
              maskedEmail={maskedEmail}
              onClick={handleEmailItemClick}
              isSelected={maskedEmail.id === selectedEmailId}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default EmailList;
