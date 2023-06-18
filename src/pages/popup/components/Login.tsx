import React from 'react';

export default function LoginComponent() {
  return (
    <div className="flex items-center h-screen w-screen bg-gray-100 lg:justify-center">
      <div className="flex flex-col overflow-hidden h-screen w-screen bg-white md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700 text-center">
            Authentication
          </h3>
          <p className="mb-3 text-gray-500 text-lg">
            Fastmail requires an authentication token to be able to access and
            manage your masked emails.
            <br />
            You can create your authentication token in your{' '}
            <a
              href="https://app.fastmail.com/settings/security/integrations"
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              Fastmail settings.
            </a>
            <br />
            This token should be created with the{' '}
            <span className="font-semibold">masked email</span> scope.
          </p>
          <form action="#" className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="auth-token"
                className="text-sm font-semibold text-gray-500"
              >
                Authentication Token
              </label>
              <input
                type="text"
                id="auth-token"
                autoFocus
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
