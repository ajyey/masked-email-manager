// @pages/popup/components/home/filter/EmailCount.tsx
import React from 'react';

interface EmailCountProps {
  count: number;
}

/**
 * Component that displays the number of emails in the list
 * @param count The number of emails in the list
 */
const EmailCount: React.FC<EmailCountProps> = ({ count }) => {
  return (
    <div className="ml-1 mr-1 text-white font-medium text-sm">{count}</div>
  );
};

export default EmailCount;
