import React, { useEffect, useState } from 'react';
import EditButton from '@pages/popup/components/home/emails/EditButton';
import FavoriteButton from '@pages/popup/components/home/emails/FavoriteButton';
import {
  getFavoriteEmailIds,
  setFavoriteEmailIds
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
      getFavoriteEmailIds().then((favoriteEmails) => {
        setIsFavorited(favoriteEmails.includes(selectedEmailId));
      });
    } else {
      setIsFavorited(false);
    }
  }, [selectedEmailId]);
  const handleFavoriteButtonClick = async () => {
    if (selectedEmailId) {
      const favoritedEmailIds = await getFavoriteEmailIds();
      if (isFavorited) {
        // Remove the email from the favorites list
        const updatedFavorites = favoritedEmailIds.filter(
          (emailId) => emailId !== selectedEmailId
        );
        await setFavoriteEmailIds(updatedFavorites);
        setIsFavorited(false);
      } else {
        // Add the email to the favorites list
        const updatedFavoritedEmailIds = [
          ...favoritedEmailIds,
          selectedEmailId
        ];
        await setFavoriteEmailIds(updatedFavoritedEmailIds);
        setIsFavorited(true);
      }
    } else {
      setIsFavorited(false);
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
