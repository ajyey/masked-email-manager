import React, { useState, useEffect } from 'react';
import LoginComponent from '@pages/popup/components/login/Login';
import HomeComponent from '@pages/popup/components/home/Home';

export default function Popup(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Check if the user has already set up their Fastmail API token
  useEffect(() => {
    chrome.storage.sync.get('fastmailToken', (result) => {
      if (result && result.fastmailToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return <div>{isAuthenticated ? <HomeComponent /> : <LoginComponent />}</div>;
}
