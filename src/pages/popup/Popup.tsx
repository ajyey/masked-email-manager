import React from 'react';
import LoginComponent from '@pages/popup/components/login/Login';
import HomeComponent from '@pages/popup/components/home/Home';

interface PopupProps {
  authenticated: boolean;
}

export default function Popup({ authenticated }: PopupProps): JSX.Element {
  const cssClass = authenticated ? 'home-component' : 'login-component';
  return (
    <div className={cssClass}>
      {authenticated ? <HomeComponent /> : <LoginComponent />}
    </div>
  );
}
