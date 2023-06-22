import React, { useEffect, useState } from 'react';
import EditButton from '@pages/popup/components/home/emails/EditButton';
import FavoriteButton from '@pages/popup/components/home/emails/FavoriteButton';
import {
  getFavoriteEmails,
  setFavoriteEmails
} from '../../../../../../utils/storageUtil';

export default function EmailDetailPane({
  selectedEmailId
}: {
  selectedEmailId: string | null;
}) {
  // Track whether the selected email is favorited
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  useEffect(() => {
    if (selectedEmailId) {
      getFavoriteEmails().then((favoriteEmails) => {
        setIsFavorited(favoriteEmails.includes(selectedEmailId));
      });
    }
  }, [selectedEmailId]);
  const handleFavoriteButtonClick = async () => {
    if (selectedEmailId) {
      const favoritedEmailIds = await getFavoriteEmails();
      if (isFavorited) {
        // Remove the email from the favorites list
        const updatedFavorites = favoritedEmailIds.filter(
          (emailId) => emailId !== selectedEmailId
        );
        await setFavoriteEmails(updatedFavorites);
        setIsFavorited(false);
      } else {
        // Add the email to the favorites list
        const updatedFavoritedEmailIds = [
          ...favoritedEmailIds,
          selectedEmailId
        ];
        await setFavoriteEmails(updatedFavoritedEmailIds);
        setIsFavorited(true);
      }
    }
  };
  return (
    <div className="h-[35px] border-b border-b-yellow-400 flex items-center justify-end">
      {/*TODO: dynamically set the isFavorited based on whether the user has fovorited this email*/}
      <FavoriteButton
        isFavorited={isFavorited}
        onClick={handleFavoriteButtonClick}
      />
      <EditButton />
    </div>
  );
}
