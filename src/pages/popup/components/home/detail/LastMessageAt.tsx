// LastMessageAt.tsx
import React from 'react';

interface LastMessageAtProps {
  lastMessageAt: string | null;
}

const LastMessageAt: React.FC<LastMessageAtProps> = ({ lastMessageAt }) => {
  return (
    <div>
      <span className="font-semibold">Last message at:</span>{' '}
      {lastMessageAt ? new Date(lastMessageAt).toLocaleString() : 'N/A'}
    </div>
  );
};

export default LastMessageAt;
