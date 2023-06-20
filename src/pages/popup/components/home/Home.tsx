import React, { useState, useEffect, useLayoutEffect } from 'react';
import icon from '@assets/img/icon.svg';
import TopComponent from '@pages/popup/components/home/top/Top';
import MaskedEmailListPane from '@pages/popup/components/home/emails/MaskedEmailListPane';
import MaskedEmailDetailPane from '@pages/popup/components/home/emails/MaskedEmailDetailPane';
import { list, MaskedEmail } from 'fastmail-masked-email';
import { FASTMAIL_API_TOKEN } from '../../../../../utils/constants';
import PopupProps from '@pages/popup/Popup';

interface HomeComponentProps {
  maskedEmails: MaskedEmail[];
}

export default function HomeComponent() {
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  // useEffect(() => {
  //   const fetchMaskedEmails = async () => {
  //     try {
  //       const storageData = await chrome.storage.sync.get('fastmail_session');
  //       const session = storageData.fastmail_session;
  //       const allMaskedEmails: MaskedEmail[] = await list(session);
  //       setMaskedEmails(allMaskedEmails);
  //     } catch (error) {
  //       console.error('Error fetching masked emails:', error);
  //     }
  //   };
  //
  //   fetchMaskedEmails();
  // }, []);
  return (
    <div className="bg-astronaut h-[400px] w-[600px]">
      <TopComponent />
      {/* Make the height 345px since the top bar is 55px (400-55=345)*/}
      <div className="w-full h-[345px] flex flex-col">
        <div className="flex flex-1">
          <div className="columns-[250px] border-r border-r-big-stone">
            <MaskedEmailListPane maskedEmails={maskedEmails} />
          </div>
          <div className="w-7/12 ml-2 mt-2">
            <MaskedEmailDetailPane />
          </div>
        </div>
      </div>
    </div>
  );
}
