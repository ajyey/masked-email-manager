// CreatedAt.tsx
import React from 'react';

interface CreatedAtProps {
  createdAt: string | null;
}

const CreatedAt: React.FC<CreatedAtProps> = ({ createdAt }) => {
  return (
    <div>
      <span className="font-semibold">Created at:</span>{' '}
      {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}
    </div>
  );
};

export default CreatedAt;
