import React, { useEffect, useState } from 'react';
import EmailList from '@pages/popup/components/home/emails/EmailList';
import EmailDetailPane from '@pages/popup/components/home/detail/EmailDetailPane';
import { getAllEmails, MaskedEmail } from 'fastmail-masked-email';
import LoadingComponent from '@pages/popup/components/home/emails/Loading';
import FilterEmailsDropdown from '@pages/popup/components/home/filter/FilterEmailsDropdown';
import TopComponent from '@pages/popup/components/home/top/Top';
import EmailCount from '@pages/popup/components/home/emails/EmailCount';
import browser from 'webextension-polyfill';
import {
  getFastmailSession,
  getDefaultFilter,
  setDefaultFilter
} from '../../../../../utils/storageUtil';
import CreateEmailModal from '@pages/popup/components/home/detail/modals/CreateEmailModal';
import LogoutConfirmationModal from '@pages/popup/components/home/detail/modals/LogoutConfirmationModal';
import {
  FILTER_OPTIONS,
  FilterOption
} from '@pages/popup/components/home/filter/FilterOption';

interface HomeComponentProps {
  onLogout: () => void;
}

export default function HomeComponent({ onLogout }: HomeComponentProps) {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState(FILTER_OPTIONS.All); // default the filtered emails to show all
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmailsCount, setFilteredEmailsCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<MaskedEmail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [host, setHost] = useState('');
  const [url, setUrl] = useState('');
  // Modal states
  const [showLogoutConfirmationModal, setShowLogoutConfirmationModal] =
    useState(false);
  const [showCreateEmailModal, setShowCreateEmailModal] = useState(false);

  const closeCreateEmailModal = () => {
    setShowCreateEmailModal(false);
  };
  const openCreateEmailModal = () => {
    setShowCreateEmailModal(true);
  };
  const closeLogoutConfirmationModal = () => {
    setShowLogoutConfirmationModal(false);
  };
  const openLogoutConfirmationModal = () => {
    setShowLogoutConfirmationModal(true);
  };

  const setFilterOptionAndRemember = (
    value: ((prevState: FilterOption) => FilterOption) | FilterOption
  ) => {
    if (typeof value == 'function') {
      setFilterOption((prevState) => {
        const newValue = value(prevState);
        setDefaultFilter(newValue);
        return newValue;
      });
    } else {
      setFilterOption(value);
      setDefaultFilter(value);
    }
  };

  useEffect(() => {
    // Declare the async function
    const fetchActiveTabUrl = async () => {
      // Fetch the URL of the active tab
      const tabs = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true
      });
      // Check if tabs exist
      if (tabs.length > 0) {
        const activeTabUrl = tabs[0].url;
        const hostname = activeTabUrl
          ? new URL(activeTabUrl).hostname.split('.').slice(-2, -1)[0]
          : '';
        setHost(hostname);
        setUrl(activeTabUrl ?? '');
      }
    };

    const fetchDefaultFilter = async () => {
      const filter = await getDefaultFilter();
      setFilterOption(filter);
    };

    // Call the async function
    fetchActiveTabUrl();
    fetchDefaultFilter();
  }, []);

  const refreshMaskedEmails = async () => {
    setIsLoading(true);
    try {
      const session = await getFastmailSession();
      const allMaskedEmails: MaskedEmail[] = await getAllEmails(session);
      const sortedEmails = allMaskedEmails.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMaskedEmails(sortedEmails);
    } catch (error) {
      console.error('Error fetching masked emails:', error);
    }
    setIsLoading(false);
  };

  const updateEmailInList = (updatedEmail: MaskedEmail) => {
    setMaskedEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  };
  const addNewEmailToEmailList = (newEmail: MaskedEmail) => {
    setMaskedEmails((prevEmails) => [newEmail, ...prevEmails]);
  };
  const removeEmailFromEmailList = (emailToRemove: MaskedEmail) => {
    setMaskedEmails((prevEmails) =>
      prevEmails.filter((email) => email.id !== emailToRemove.id)
    );
  };

  useEffect(() => {
    refreshMaskedEmails();
  }, []);

  return (
    <div className="bg-astronaut h-[400px] w-[600px]">
      <TopComponent
        onSearchChange={setSearchQuery}
        onRefresh={refreshMaskedEmails}
        onLogout={onLogout}
        addNewEmailToEmailList={addNewEmailToEmailList}
        setSelectedEmail={setSelectedEmail}
        activeTabUrl={url}
        openLogoutConfirmationModal={openLogoutConfirmationModal}
        closeLogoutConfirmationModal={closeLogoutConfirmationModal}
        openCreateEmailModal={openCreateEmailModal}
        closeCreateEmailModal={closeCreateEmailModal}
      />
      {showLogoutConfirmationModal && (
        <LogoutConfirmationModal
          closeModal={closeLogoutConfirmationModal}
          logout={onLogout}
        />
      )}
      {showCreateEmailModal && (
        <CreateEmailModal
          closeModal={closeCreateEmailModal}
          activeTabHost={host}
          activeTabUrl={url}
          addNewEmailToEmailList={addNewEmailToEmailList}
          setSelectedEmail={setSelectedEmail}
          setFilterOption={setFilterOption}
        />
      )}
      <div className="w-full h-[345px] flex flex-col">
        <div className="flex flex-1">
          <div className="columns-[250px] border-r border-r-big-stone">
            <div className="h-[35px] border-b border-b-big-stone flex items-center justify-center">
              <FilterEmailsDropdown
                setFilterOption={setFilterOptionAndRemember}
                filterOption={filterOption}
              />
              <EmailCount count={filteredEmailsCount} />
            </div>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <EmailList
                maskedEmails={maskedEmails}
                filter={filterOption}
                searchQuery={searchQuery}
                onFilteredEmailsCountChange={setFilteredEmailsCount}
                setSelectedEmail={setSelectedEmail}
                selectedEmail={selectedEmail}
                setIsEditing={setIsEditing}
              />
            )}
          </div>
          <div className="columns-[350px] h-[345px]">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <EmailDetailPane
                selectedEmail={selectedEmail}
                updateEmailInList={updateEmailInList}
                removeEmailFromEmailList={removeEmailFromEmailList}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
