import React, { useState } from 'react';
import { getSession } from 'fastmail-masked-email';
import icon from '@assets/img/icon.svg';
import { setFastmailSession } from '../../../../../utils/storageUtil';

interface LoginComponentProps {
  onLoginSuccess: () => void;
}

export default function LoginComponent({
  onLoginSuccess
}: LoginComponentProps) {
  const [apiToken, setApiToken] = useState('');

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiToken(e.target.value);
  };
  /**
   * When the user submits the form, store the API token and the fastmail session in Chrome storage
   */
  const handleSubmit = async () => {
    const session = await getSession(apiToken);
    //TODO: Handle error if the user enters an invalid API token
    await setFastmailSession(session);
    // Call the onLoginSuccess callback after a successful login
    onLoginSuccess();
  };
  return (
    <div className="flex items-center h-screen w-screen lg:justify-center bg-astronaut text-white">
      <div className="min-h-full flex items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-[16px]">
            <img
              src={icon}
              className="mx-auto h-24 w-auto pointer-events-none"
              alt="icon"
            />
            <p className="mt-6 text-2xl font-extrabold mb-3 text-center">
              Masked Email Manager
            </p>
            <p className="mb-3">
              Masked Email Manager requires a Fastmail API token with the{' '}
              <span className="font-semibold text-mikado-yellow">
                masked email
              </span>{' '}
              scope to be able to access and manage your masked emails. Login
              with yours below.
            </p>
            <p className="mb-3">
              Learn how to create your API token{' '}
              <a
                className="text-malibu hover:text-mikado-yellow font-bold"
                href="https://www.fastmail.help/hc/en-us/articles/5254602856719-API-tokens"
                target="_blank"
                rel="noopener noreferrer"
              >
                here.
              </a>
            </p>
          </div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="api-token" className="sr-only">
                  Fastmail API Token
                </label>
                <input
                  id="api-token"
                  name="api-token"
                  type="text"
                  required
                  onChange={handleTokenChange}
                  value={apiToken}
                  className="appearance-none relative block
                  w-full px-3 py-2 border border-gray-300
                  placeholder-gray-500 text-gray-900 rounded-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 text-[14px]"
                  placeholder="Token"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
