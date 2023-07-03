// CreatedAt.tsx
import React from 'react';

interface CreatedByProps {
  createdBy: string | null;
}

const CreatedBy: React.FC<CreatedByProps> = ({ createdBy }) => {
  return (
    <div>
      <span className="font-semibold">Created by:</span> {createdBy}
    </div>
  );
};

export default CreatedBy;
