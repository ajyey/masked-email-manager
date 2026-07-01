import React, { JSX } from 'react';
import LoginComponent from '@pages/popup/components/login/Login';
import HomeComponent from '@pages/popup/components/home/Home';
import { useAuth } from '@src/contexts/AuthContext';

export default function Popup(): JSX.Element {
  const { isAuthenticated, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-astronaut text-white">
        <div>Loading...</div>
      </div>
    );
  }

  const cssClass = isAuthenticated ? 'home-component' : 'login-component';

  const handleLoginSuccess = async (apiToken: string) => {
    await login(apiToken);
  };

  return (
    <div className={cssClass}>
      {isAuthenticated ? (
        <HomeComponent onLogout={logout} />
      ) : (
        <LoginComponent onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
