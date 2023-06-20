import React, { useState } from 'react';
import LoginSubmitButtonComponent from '@pages/popup/components/login/LoginSubmitButton';
import { getSession } from 'fastmail-masked-email';

export default function LoginComponent() {
  const [apiToken, setApiToken] = useState('');

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiToken(e.target.value);
  };
  /**
   * When the user submits the form, store the API token and the fastmail session in Chrome storage
   */
  const handleSubmit = async () => {
    await chrome.storage.sync.set({ fastmail_api_token: apiToken });
    const session = await getSession(apiToken);
    //TODO: Handle error if the user enters an invalid API token
    await chrome.storage.sync.set({ fastmail_session: session });
  };
  return (
    <div className="flex items-center h-screen w-screen lg:justify-center">
      <div className="h-screen w-screen">
        <div className="p-5 bg-gray-800 md:flex-1 h-screen w-screen">
          <h3 className="my-4 text-2xl font-semibold text-white text-center">
            Authentication
          </h3>
          <p className="mb-3 text-white text-lg">
            Fastmail requires an API token with the{' '}
            <span className="font-semibold">masked email</span> scope to be able
            to access and manage your masked emails.
            <br />
            You can learn more about creating an API token{' '}
            <a
              className="text-blue-400"
              href="https://www.fastmail.help/hc/en-us/articles/5254602856719-API-tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col space-y-5"
          >
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="auth-token"
                className="text-sm font-semibold text-gray-300"
              >
                Authentication Token
              </label>
              <input
                type="text"
                id="auth-token"
                autoFocus
                value={apiToken}
                onChange={handleTokenChange}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>
            <div>
              <LoginSubmitButtonComponent />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
