import React, { useState } from 'react';
import LoginComponent from '@pages/popup/components/login/Login';
import HomeComponent from '@pages/popup/components/home/Home';

interface PopupProps {
  authenticated: boolean;
}

export default function Popup({ authenticated }: PopupProps): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(authenticated);
  const cssClass = isLoggedIn ? 'home-component' : 'login-component';
  // Callback function to update the isLoggedIn state
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className={cssClass}>
      {isLoggedIn ? (
        <HomeComponent />
      ) : (
        // Pass the handleLoginSuccess callback to the LoginComponent
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
