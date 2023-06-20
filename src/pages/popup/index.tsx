import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/popup/index.css';
import '@assets/styles/tailwind.css';
import Popup from '@pages/popup/Popup';
import { FASTMAIL_API_TOKEN } from '../../../utils/constants';
import { list, MaskedEmail } from 'fastmail-masked-email';

/**
 * Check if the user is already authenticated and their API key is stored in Chrome storage
 */
const getAuthenticationStatus = (): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(FASTMAIL_API_TOKEN, (result) => {
      if (result && result.fastmail_api_token) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
async function init() {
  const rootContainer = document.querySelector('#__root');
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Popup authenticated={await getAuthenticationStatus()} />);
}
init();
