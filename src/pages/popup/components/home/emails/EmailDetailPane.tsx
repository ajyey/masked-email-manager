import React from 'react';
import EditButton from '@pages/popup/components/home/emails/EditButton';
import FavoriteButton from '@pages/popup/components/home/emails/FavoriteButton';

export default function EmailDetailPane() {
  return (
    <div className="h-[35px] border-b border-b-yellow-400 flex items-center justify-end">
      {/*TODO: dynamically set the isFavorited based on whether the user has fovorited this email*/}
      <FavoriteButton isFavorited={false} />
      <EditButton />
    </div>
  );
}
