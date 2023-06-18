import React from 'react';
import icon from '@assets/img/icon.svg';
export default function HomeComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center p-3 bg-gray-800">
      <div className="h-[400px] w-[600px] bg-gray-800">
        <header className="flex flex-col items-center justify-center text-white">
          <img
            src={icon}
            className="h-36 pointer-events-none animate-spin-slow"
            alt="icon"
          />
          <p>
            Edit <code>src/pages/popup/Popup.jsx</code> and save to reload.
          </p>
          <a
            className="text-blue-400"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React!
          </a>
          <p>Popup styled with TailwindCSS!</p>
        </header>
      </div>
    </div>
  );
}
