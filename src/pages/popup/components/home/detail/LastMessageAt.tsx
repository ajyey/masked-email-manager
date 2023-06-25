// LastMessageAt.tsx
import React from 'react';

interface LastMessageAtProps {
  lastMessageAt: string | null;
}

const LastMessageAt: React.FC<LastMessageAtProps> = ({ lastMessageAt }) => {
  console.log('lastMessageAt', lastMessageAt);
  return (
    <div className="mr-4">
      <span className="font-semibold">Last Message At:</span>{' '}
      {lastMessageAt ? new Date(lastMessageAt).toLocaleString() : 'N/A'}
    </div>
  );
};

export default LastMessageAt;
