import React, { useState, useEffect } from 'react';
import EmailList from '@pages/popup/components/home/emails/EmailList';
import EmailDetailPane from '@pages/popup/components/home/emails/EmailDetailPane';
import { list, MaskedEmail } from 'fastmail-masked-email';
import LoadingComponent from '@pages/popup/components/home/emails/Loading';
import FilterEmailsDropdown from '@pages/popup/components/home/filter/FilterEmailsDropdown';
import TopComponent from '@pages/popup/components/home/top/Top';

export default function HomeComponent() {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshMaskedEmails = async () => {
    setIsLoading(true);
    try {
      const storageData = await chrome.storage.sync.get('fastmail_session');
      const session = storageData.fastmail_session;
      const allMaskedEmails: MaskedEmail[] = await list(session);
      setMaskedEmails(allMaskedEmails);
    } catch (error) {
      console.error('Error fetching masked emails:', error);
    }
    setIsLoading(false);
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
            {/*<FilterPane onFilterChange={setFilterOption()} />*/}
            <div className="h-[35px] border-b border-b-big-stone flex items-center justify-center">
              <FilterEmailsDropdown onFilterChange={setFilterOption} />
            </div>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <EmailList
                maskedEmails={maskedEmails}
                filter={filterOption}
                searchQuery={searchQuery}
              />
            )}
          </div>
          <div className="columns-[350px]">
            <EmailDetailPane />
          </div>
        </div>
      </div>
    </div>
  );
}
