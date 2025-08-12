import React, { useEffect, useState } from 'react';
import FavoriteButton from '@pages/popup/components/home/detail/buttons/FavoriteButton';
import {
  getFavoriteEmailIds,
  setFavoriteEmailIds
} from '../../../../../../utils/storageUtil';
import {
  MaskedEmail,
  MaskedEmailService,
  MaskedEmailState,
  Options
} from 'fastmail-masked-email';
import EmailAddress from '@pages/popup/components/home/detail/EmailAddress';
import EmailDescription from '@pages/popup/components/home/detail/EmailDescription';
import EmailId from '@pages/popup/components/home/detail/EmailId';
import EmailDomain from '@pages/popup/components/home/detail/EmailDomain';
import { CopyIcon } from '@pages/popup/components/home/icons/icons';
import EmailStateToggle from '@pages/popup/components/home/detail/buttons/EmailStateToggle';
import NoEmailSelected from '@pages/popup/components/home/detail/NoEmailSelected';
import LastMessageAt from '@pages/popup/components/home/detail/LastMessageAt';
import CreatedAt from '@pages/popup/components/home/detail/CreatedAt';
import { Toaster } from 'react-hot-toast';
import CreatedBy from '@pages/popup/components/home/detail/CreatedBy';
import SaveButton from '@pages/popup/components/home/detail/buttons/SaveButton';
import EditButton from '@pages/popup/components/home/detail/buttons/EditButton';
import CancelEditingButton from '@pages/popup/components/home/detail/buttons/CancelEditingButton';
import DeleteButton from '@pages/popup/components/home/detail/buttons/DeleteButton';
import { displaySuccessToast } from '../../../../../../utils/toastUtil';
import {
  COLOR_BIG_STONE,
  COLOR_WHITE
} from '../../../../../../utils/constants/colors';
import PermanentlyDeleteButton from '@pages/popup/components/home/detail/buttons/PermanentlyDeleteButton';
import PermanentDeleteConfirmationModal from '@pages/popup/components/home/detail/modals/PermanentDeleteConfirmationModal';
import { useAuth } from '@src/contexts/AuthContext';
import { getMaskedEmailService } from '@src/service';

export default function EmailDetailPane({
  selectedEmail,
  updateEmailInList,
  isEditing,
  setIsEditing,
  removeEmailFromEmailList
}: {
  selectedEmail: MaskedEmail | null;
  updateEmailInList: (updatedEmail: MaskedEmail) => void;
  isEditing: boolean;
  setIsEditing: (value: ((prevState: boolean) => boolean) | boolean) => void;
  removeEmailFromEmailList: (emailToRemove: MaskedEmail) => void;
}) {
  const { getService } = useAuth();
  // State for permanent delete confirmation modal visibility
  const [
    showPermanentDeleteConfirmationModal,
    setShowPermanentDeleteConfirmationModal
  ] = useState(false);
  // Track whether the selected email is favorited
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  // Track whether the user has clicked the copy button for an email detail and we need to show the alert
  const [updatedDescription, setUpdatedDescription] = useState<string | null>(
    selectedEmail?.description || null
  );
  const [updatedDomain, setUpdatedDomain] = useState<string | null>(
    selectedEmail?.forDomain || null
  );

  const openPermanentDeleteConfirmationModal = () => {
    setShowPermanentDeleteConfirmationModal(true);
  };

  const closePermanentDeleteConfirmationModal = () => {
    setShowPermanentDeleteConfirmationModal(false);
  };

  // Handle delete action
  const handleDelete = async () => {
    if (selectedEmail) {
      //TODO: Add better error handling
      const service: MaskedEmailService = await getService();
      await service.deleteEmail(selectedEmail.id);
      updateEmailInList({ ...selectedEmail, state: 'deleted' }); // Update the email in the email list
      selectedEmail.state = 'deleted'; // Update the email in the email detail
      closePermanentDeleteConfirmationModal();
    }
  };
  const handlePermanentDelete = async () => {
    if (selectedEmail) {
      const service: MaskedEmailService = await getService();
      //TODO: Add better error handling here
      await service.permanentlyDeleteEmail(selectedEmail.id);
      removeEmailFromEmailList(selectedEmail);
      closePermanentDeleteConfirmationModal();
    }
  };
  const handleDescriptionChange = (newDescription: string) => {
    setUpdatedDescription(newDescription);
  };
  const handleSetIsEditing = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };
  const handleDomainChange = (newDomain: string) => {
    setUpdatedDomain(newDomain);
  };

  // Show a toast for 2 seconds to let the user know that the email was copied to the clipboard
  const handleCopyAlert = () => {
    displaySuccessToast(
      'Copied to clipboard!',
      <CopyIcon iconClasses={'w-5 h-5 stroke-1'} />,
      COLOR_BIG_STONE,
      COLOR_WHITE
    );
  };
  // Copy the text to the clipboard (when the user clicks on email, description, id, or domain)
  // and show the copy alert
  const handleCopyClick = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    handleCopyAlert();
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
        // remove the email from the favorites list
      } else {
        // Add the email to the favorites list
        const updatedFavoritedEmailIds = [
          ...favoritedEmailIds,
          selectedEmail.id
        ];
        await setFavoriteEmailIds(updatedFavoritedEmailIds);
        setIsFavorited(true);
      }
      // need this to trigger the applyFilter function in the email list pane
      // since the useEffect that triggers applyFilter has a dependency on the masked emails list
      // TODO: come up with a better solution for updating the email list in real time
      updateEmailInList(selectedEmail);
    } else {
      setIsFavorited(false);
    }
  };
  const handleEditButtonClick = () => {
    setIsEditing(true);
  };
  const handleEmailStateChange = async (newEmailState: MaskedEmailState) => {
    if (selectedEmail) {
      // Make the API call to update the email state
      const service: MaskedEmailService = await getMaskedEmailService();
      if (newEmailState === 'disabled') {
        await service.disableEmail(selectedEmail.id);
      } else if (newEmailState === 'enabled') {
        await service.enableEmail(selectedEmail.id);
      }
      // Update the email in the list so that the changes are reflected in the email list pane
      // For example, if the user is viewing the 'Enabled' emails and they disable an email,
      // then the email will be reflected (removed in this case) in the list
      const updatedSelectedEmail = { ...selectedEmail, state: newEmailState };
      updateEmailInList(updatedSelectedEmail);
      // Updates the selected email state so that the changes are reflected by the toggle button
      selectedEmail.state = newEmailState;
    }
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
      const service: MaskedEmailService = await getService();
      const updateOptions: Options = {};
      if (updatedDescription != null) {
        updateOptions['description'] = updatedDescription;
      }
      if (updatedDomain != null) {
        updateOptions['forDomain'] = updatedDomain;
      }
      await service.updateEmail(selectedEmail.id, updateOptions);
      selectedEmail.description =
        updatedDescription ?? selectedEmail.description;
      selectedEmail.forDomain = updatedDomain ?? selectedEmail.forDomain;
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
    <div className={'h-full'}>
      <div className={'flex flex-col h-full'}>
        {/* If there is an email selected, show the details, otherwise show the NoEmailSelected component*/}
        {selectedEmail ? (
          <>
            <div
              className={`h-[35px] py-1 border-b border-b-big-stone flex items-center ${
                isEditing ? 'justify-end' : 'justify-evenly'
              }`}
            >
              {/*Only allow the user to toggle the state of the email while not editing*/}
              {!isEditing && (
                <EmailStateToggle
                  emailState={selectedEmail?.state}
                  onEmailStateChange={handleEmailStateChange}
                />
              )}
              {!isEditing && (
                <DeleteButton
                  onClick={handleDelete}
                  disabled={selectedEmail.state === 'deleted'} // Disable the delete button if the email is already deleted
                />
              )}
              {/* Permanent Delete Confirmation Modal */}
              {showPermanentDeleteConfirmationModal && (
                <PermanentDeleteConfirmationModal
                  closeModal={closePermanentDeleteConfirmationModal}
                  handlePermanentDelete={handlePermanentDelete} //TODO:
                  selectedEmail={selectedEmail}
                />
              )}
              {isEditing ? (
                <CancelEditingButton
                  onClick={() => handleSetIsEditing(false)}
                />
              ) : (
                <FavoriteButton
                  isFavorited={isFavorited}
                  onClick={handleFavoriteButtonClick}
                />
              )}
              {isEditing ? (
                <SaveButton onClick={handleSaveButtonClick} />
              ) : (
                <EditButton onClick={handleEditButtonClick} />
              )}
            </div>
            <div
              className={
                'overflow-y-auto scrollbar flex flex-col h-full justify-between'
              }
            >
              <div className={'mt-4 ml-4 mr-4'}>
                <EmailAddress
                  emailAddress={selectedEmail ? selectedEmail.email : null}
                  isEditing={isEditing}
                  handleCopyClick={handleCopyClick}
                />
                <EmailDomain
                  emailDomain={emailDomain}
                  isEditing={isEditing}
                  onDomainChange={handleDomainChange}
                  handleCopyClick={handleCopyClick}
                />
                <EmailDescription
                  emailDescription={emailDescription}
                  isEditing={isEditing}
                  onDescriptionChange={handleDescriptionChange}
                  handleCopyClick={handleCopyClick}
                />
                <EmailId
                  emailId={selectedEmail ? selectedEmail.id : null}
                  isEditing={isEditing}
                  handleCopyClick={handleCopyClick}
                />
                {/* Create a toast to tell the user the text was copied to their clipboard*/}
                <Toaster />
              </div>
              {selectedEmail &&
                selectedEmail.lastMessageAt === null &&
                selectedEmail.state === 'deleted' && (
                  <PermanentlyDeleteButton
                    onClick={openPermanentDeleteConfirmationModal}
                  />
                )}
              <div className="flex items-center justify-center mt-2 mb-3 text-gray-200 flex-col text-xs">
                {selectedEmail.lastMessageAt && (
                  <div>
                    <LastMessageAt
                      lastMessageAt={
                        selectedEmail ? selectedEmail.lastMessageAt : null
                      }
                    />
                  </div>
                )}
                {selectedEmail.createdAt && (
                  <div>
                    <CreatedAt
                      createdAt={selectedEmail ? selectedEmail.createdAt : null}
                    />
                  </div>
                )}
                {selectedEmail.createdBy && (
                  <div>
                    <CreatedBy
                      createdBy={selectedEmail ? selectedEmail.createdBy : null}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <NoEmailSelected />
          </div>
        )}
      </div>
    </div>
  );
}
