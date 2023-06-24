import React, { useEffect, useState } from 'react';
import EditButton from '@pages/popup/components/home/detail/EditButton';
import FavoriteButton from '@pages/popup/components/home/detail/FavoriteButton';
import {
  getFastmailSession,
  getFavoriteEmailIds,
  setFavoriteEmailIds
} from '../../../../../../utils/storageUtil';
import { MaskedEmail, Options, Session, update } from 'fastmail-masked-email';
import EmailAddress from '@pages/popup/components/home/detail/EmailAddress';
import EmailDescription from '@pages/popup/components/home/detail/EmailDescription';
import EmailId from '@pages/popup/components/home/detail/EmailId';
import EmailDomain from '@pages/popup/components/home/detail/EmailDomain';
import SaveButton from '@pages/popup/components/home/detail/SaveButton';

export default function EmailDetailPane({
  selectedEmail,
  updateEmailInList
}: {
  selectedEmail: MaskedEmail | null;
  updateEmailInList: (updatedEmail: MaskedEmail) => void;
}) {
  // Track whether the selected email is favorited
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedDescription, setUpdatedDescription] = useState<string | null>(
    selectedEmail?.description || null
  );
  const [updatedDomain, setUpdatedDomain] = useState<string | null>(
    selectedEmail?.forDomain || null
  );
  const [updatedEmail, setUpdatedEmail] = useState<MaskedEmail | null>(null);
  const handleDescriptionChange = (newDescription: string) => {
    setUpdatedDescription(newDescription);
  };
  const handleDomainChange = (newDomain: string) => {
    setUpdatedDomain(newDomain);
  };

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
  const handleEditButtonClick = () => {
    setIsEditing(true);
  };
  const handleSaveButtonClick = async () => {
    if (selectedEmail) {
      // If no edits were made, then just exit edit mode
      if (
        (updatedDescription === selectedEmail.description &&
          updatedDomain === selectedEmail.forDomain) ||
        (updatedDescription == null && updatedDomain == null)
      ) {
        setIsEditing(false);
        return;
      }
      const session: Session = await getFastmailSession();
      const updateOptions: Options = {};
      if (updatedDescription != null) {
        updateOptions['description'] = updatedDescription;
      }
      if (updatedDomain != null) {
        updateOptions['forDomain'] = updatedDomain;
      }
      await update(selectedEmail.id, session, updateOptions);
      selectedEmail.description =
        updatedDescription || selectedEmail.description;
      selectedEmail.forDomain = updatedDomain || selectedEmail.forDomain;
      // Update the email in the list so that the changes are reflected in the email list pane
      updateEmailInList(selectedEmail);
    }
    setIsEditing(false);
  };

  let emailDescription: string | null = null;
  let emailDomain: string | null = null;
  if (selectedEmail) {
    emailDescription = selectedEmail.description;
    emailDomain = selectedEmail.forDomain;
  }
  return (
    <div>
      <div className="h-[35px] border-b border-b-yellow-400 flex items-center justify-end">
        <FavoriteButton
          isFavorited={isFavorited}
          onClick={handleFavoriteButtonClick}
        />
        {isEditing ? (
          <SaveButton onClick={handleSaveButtonClick} />
        ) : (
          <EditButton onClick={handleEditButtonClick} />
        )}
      </div>
      <div className={'mt-4 ml-4 mr-4'}>
        <EmailAddress
          emailAddress={selectedEmail ? selectedEmail.email : null}
          isEditing={isEditing}
        />
        <EmailDomain
          emailDomain={emailDomain}
          isEditing={isEditing}
          onDomainChange={handleDomainChange}
        />
        <EmailDescription
          emailDescription={emailDescription}
          isEditing={isEditing}
          onDescriptionChange={handleDescriptionChange}
        />
        <EmailId
          emailId={selectedEmail ? selectedEmail.id : null}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
