import React, { useEffect, useState } from 'react';
import EmailList from '@pages/popup/components/home/emails/EmailList';
import EmailDetailPane from '@pages/popup/components/home/detail/EmailDetailPane';
import { list, MaskedEmail } from 'fastmail-masked-email';
import LoadingComponent from '@pages/popup/components/home/emails/Loading';
import FilterEmailsDropdown from '@pages/popup/components/home/filter/FilterEmailsDropdown';
import TopComponent from '@pages/popup/components/home/top/Top';
import EmailCount from '@pages/popup/components/home/emails/EmailCount';
import { FASTMAIL_SESSION_KEY } from '../../../../../utils/constants';
import browser from 'webextension-polyfill';

export default function HomeComponent() {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('favorited');
  const [searchQuery, setSearchQuery] = useState('');
  // State for keeping track of the count of filtered emails
  const [filteredEmailsCount, setFilteredEmailsCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<MaskedEmail | null>(null);

  const refreshMaskedEmails = async () => {
    setIsLoading(true);
    try {
      const storageData = await browser.storage.sync.get(FASTMAIL_SESSION_KEY);
      const session = storageData[FASTMAIL_SESSION_KEY];
      const allMaskedEmails: MaskedEmail[] = await list(session);
      setMaskedEmails(allMaskedEmails);
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
  useEffect(() => {
    refreshMaskedEmails();
  }, []);

  return (
    <div className="bg-astronaut h-[400px] w-[600px]">
      <TopComponent
        onSearchChange={setSearchQuery}
        onRefresh={refreshMaskedEmails}
      />
      {/* Make the height 345px since the top bar is 55px (400-55=345)*/}
      <div className="w-full h-[345px] flex flex-col">
        <div className="flex flex-1">
          <div className="columns-[250px] border-r border-r-big-stone">
            <div className="h-[35px] border-b border-b-big-stone flex items-center justify-center">
              <FilterEmailsDropdown onFilterChange={setFilterOption} />
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
