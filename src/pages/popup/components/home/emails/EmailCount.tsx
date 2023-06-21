// @pages/popup/components/home/filter/EmailCount.tsx
import React from 'react';

interface EmailCountProps {
  count: number;
}

const EmailCount: React.FC<EmailCountProps> = ({ count }) => {
  return <div className="ml-1 mr-1 text-white font-medium">{count}</div>;
};

export default EmailCount;
