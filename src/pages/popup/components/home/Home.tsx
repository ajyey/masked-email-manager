import React, { useState, useEffect } from 'react';
import TopComponent from '@pages/popup/components/home/top/Top';
import MaskedEmailListPane from '@pages/popup/components/home/email-list-pane/MaskedEmailListPane';
import MaskedEmailDetailPane from '@pages/popup/components/home/email-list-pane/MaskedEmailDetailPane';
import { list, MaskedEmail } from 'fastmail-masked-email';
import LoadingComponent from '@pages/popup/components/home/email-list-pane/Loading';
import FilterEmailsDropdown from '@pages/popup/components/home/filter-pane/FilterEmailsDropdown';

export default function HomeComponent() {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    const fetchMaskedEmails = async () => {
      try {
        const storageData = await chrome.storage.sync.get('fastmail_session');
        const session = storageData.fastmail_session;
        const allMaskedEmails: MaskedEmail[] = await list(session);
        setMaskedEmails(allMaskedEmails);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching masked emails:', error);
      }
    };

    fetchMaskedEmails();
  }, []);
  return (
    <div className="bg-astronaut h-[400px] w-[600px]">
      <TopComponent />
      {/* Make the height 345px since the top bar is 55px (400-55=345)*/}
      <div className="w-full h-[345px] flex flex-col">
        <div className="flex flex-1">
          <div className="columns-[250px] border-r border-r-big-stone">
            {/*<FilterPane onFilterChange={setFilterOption()} />*/}
            <div className="h-[35px] border-b border-b-big-stone">
              <FilterEmailsDropdown onFilterChange={setFilterOption} />
            </div>
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <MaskedEmailListPane
                maskedEmails={maskedEmails}
                filter={filterOption}
              />
            )}
          </div>
          <div className="columns-[350px]">
            <MaskedEmailDetailPane />
          </div>
        </div>
      </div>
    </div>
  );
}
