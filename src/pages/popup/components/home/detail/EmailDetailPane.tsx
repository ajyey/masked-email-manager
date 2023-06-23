import React, { useEffect, useState } from 'react';
import EditButton from '@pages/popup/components/home/detail/EditButton';
import FavoriteButton from '@pages/popup/components/home/detail/FavoriteButton';
import {
  getFavoriteEmailIds,
  setFavoriteEmailIds
} from '../../../../../../utils/storageUtil';
import { MaskedEmail } from 'fastmail-masked-email';
import EmailAddress from '@pages/popup/components/home/detail/EmailAddress';
import EmailDescription from '@pages/popup/components/home/detail/EmailDescription';
import EmailId from '@pages/popup/components/home/detail/EmailId';
import EmailDomain from '@pages/popup/components/home/detail/EmailDomain';

export default function EmailDetailPane({
  selectedEmail
}: {
  selectedEmail: MaskedEmail | null;
}) {
  // Track whether the selected email is favorited
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  useEffect(() => {
    if (selectedEmail) {
      getFavoriteEmailIds().then((favoriteEmails) => {
        setIsFavorited(favoriteEmails.includes(selectedEmail.id));
      });
    } else {
      setIsFavorited(false);
    }
  }, [selectedEmail]);
  const handleFavoriteButtonClick = async () => {
    if (selectedEmail) {
      const favoritedEmailIds = await getFavoriteEmailIds();
      if (isFavorited) {
        // Remove the email from the favorites list
        const updatedFavorites = favoritedEmailIds.filter(
          (emailId) => emailId !== selectedEmail.id
        );
        await setFavoriteEmailIds(updatedFavorites);
        setIsFavorited(false);
      } else {
        // Add the email to the favorites list
        const updatedFavoritedEmailIds = [
          ...favoritedEmailIds,
          selectedEmail.id
        ];
        await setFavoriteEmailIds(updatedFavoritedEmailIds);
        setIsFavorited(true);
      }
    } else {
      setIsFavorited(false);
    }
  };
  return (
    <div>
      <div className="h-[35px] border-b border-b-yellow-400 flex items-center justify-end">
        {/*TODO: dynamically set the isFavorited based on whether the user has fovorited this email*/}
        <FavoriteButton
          isFavorited={isFavorited}
          onClick={handleFavoriteButtonClick}
        />
        <EditButton />
      </div>
      <div className={'mt-4 ml-4 mr-4'}>
        <EmailAddress
          emailAddress={selectedEmail ? selectedEmail.email : null}
        />
        <EmailDomain
          emailDomain={selectedEmail?.forDomain ? selectedEmail.forDomain : ''}
        />
        <EmailDescription
          emailDescription={selectedEmail ? selectedEmail.description : null}
        />
        <EmailId emailId={selectedEmail ? selectedEmail.id : null} />
      </div>
    </div>
  );
}
