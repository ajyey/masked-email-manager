import { useEffect, useRef, useState } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import EmailItem from '@pages/popup/components/home/emails/EmailItem';
import Fuse from 'fuse.js';
import { getFavoriteEmailIds } from '../../../../../../utils/storageUtil';
import {
  FILTER_OPTIONS,
  FilterOption
} from '@pages/popup/components/home/filter/FilterOption';

function isFuseResult(obj: object): obj is Fuse.FuseResult<MaskedEmail> {
  return 'item' in obj;
}
interface Props {
  maskedEmails: MaskedEmail[];
  filter: FilterOption;
  searchQuery: string;
  onFilteredEmailsCountChange: (count: number) => void;
  setSelectedEmail: (email: MaskedEmail | null) => void;
  selectedEmail: MaskedEmail | null;
  setIsEditing: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
function EmailList({
  maskedEmails,
  filter,
  searchQuery,
  onFilteredEmailsCountChange,
  setSelectedEmail,
  selectedEmail,
  setIsEditing
}: Props) {
  const [favoriteEmails, setFavoriteEmails] = useState<MaskedEmail[]>([]);
  const selectedEmailRef = useRef<HTMLLIElement | null>(null);
  const filteredEmails =
    filter === FILTER_OPTIONS.Favorites
      ? favoriteEmails
      : filter === FILTER_OPTIONS.All
        ? maskedEmails
        : maskedEmails.filter(
            (email: MaskedEmail) => email.state === filter.value.toLowerCase()
          );

  // This effect is triggered when the selectedEmail or filteredEmails change to handle scrolling the currently selected email into view
  // The email will be scrolled into view when the selectedEmail or filteredEmails change, the latter of which is useful for when the user
  // switches between the different filter options from the dropdown
  useEffect(() => {
    // Check if the selectedEmailRef has a current value
    if (selectedEmailRef.current) {
      // If it does, scroll the email list so that the selected email is visible
      // in the viewport
      selectedEmailRef.current.scrollIntoView({
        block: 'center' // Align the selected email with the center of the viewport
      });
    }
  }, [filteredEmails]);

  useEffect(() => {
    if (filter === FILTER_OPTIONS.Favorites) {
      const filterFavoriteEmails = async () => {
        const favoritedEmails = await getFavoriteEmailIds();
        setFavoriteEmails(
          maskedEmails.filter((email: MaskedEmail) =>
            favoritedEmails.includes(email.id)
          )
        );
      };
      void filterFavoriteEmails();
    }
  }, [filter, maskedEmails]);

  // Use Fuse.js to perform the fuzzy search
  const fuse: Fuse<MaskedEmail> = new Fuse(filteredEmails, {
    keys: ['email', 'description', 'id', 'forDomain'],
    threshold: 0.3,
    useExtendedSearch: true
  });
  const searchResults = searchQuery ? fuse.search(searchQuery) : filteredEmails;
  const handleEmailItemClick = (email: MaskedEmail) => {
    setSelectedEmail(email);
    setIsEditing(false);
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
  }, [
    onFilteredEmailsCountChange,
    searchResults,
    selectedEmail,
    setSelectedEmail
  ]);

  return (
    <div className="h-[310px] overflow-y-auto overflow-x-hidden scrollbar pt-2 pb-2">
      <ul
        className="flex flex-col space-y-2 w-full"
        role="listbox"
        aria-label="Masked emails"
      >
        {searchResults.map((result) => {
          const maskedEmail: MaskedEmail = isFuseResult(result)
            ? result.item
            : result;
          return (
            <EmailItem
              key={maskedEmail.id}
              ref={
                maskedEmail.id === selectedEmail?.id ? selectedEmailRef : null
              }
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
