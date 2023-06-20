import React, { useState, useEffect } from 'react';
import TopComponent from '@pages/popup/components/home/top/Top';
import MaskedEmailListPane from '@pages/popup/components/home/emailListPane/MaskedEmailListPane';
import MaskedEmailDetailPane from '@pages/popup/components/home/emailListPane/MaskedEmailDetailPane';
import { list, MaskedEmail } from 'fastmail-masked-email';
import LoadingComponent from '@pages/popup/components/home/emailListPane/Loading';

export default function HomeComponent() {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="w-full h-[345px] flex flex-col overflow-y-auto">
        <div className="flex flex-1">
          <div className="columns-[250px] border-r border-r-big-stone">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <MaskedEmailListPane maskedEmails={maskedEmails} />
            )}
          </div>
          <div className="w-7/12 ml-2 mt-2">
            <MaskedEmailDetailPane />
          </div>
        </div>
      </div>
    </div>
  );
}
