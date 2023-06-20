import React from 'react';
import LoginComponent from '@pages/popup/components/login/Login';
import HomeComponent from '@pages/popup/components/home/Home';
import { MaskedEmail } from 'fastmail-masked-email';

interface PopupProps {
  authenticated: boolean;
}

export default function Popup({ authenticated }: PopupProps): JSX.Element {
  return <div>{authenticated ? <HomeComponent /> : <LoginComponent />}</div>;
}
