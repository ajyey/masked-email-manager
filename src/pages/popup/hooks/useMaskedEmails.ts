import { useCallback, useEffect, useState } from 'react';
import { MaskedEmail } from 'fastmail-masked-email';
import { toast } from 'react-hot-toast';

import { useAuth } from '@src/contexts/AuthContext';

export default function useMaskedEmails() {
  const { getService } = useAuth();
  const [maskedEmails, setMaskedEmails] = useState<MaskedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMaskedEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const service = await getService();
      setMaskedEmails(await service.getAllEmails());
    } catch (error) {
      console.error('Error fetching masked emails:', error);
      toast.error('Unable to load masked emails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [getService]);

  useEffect(() => {
    void refreshMaskedEmails();
  }, [refreshMaskedEmails]);

  const updateEmailInList = useCallback((updatedEmail: MaskedEmail) => {
    setMaskedEmails((emails) =>
      emails.map((email) =>
        email.id === updatedEmail.id ? updatedEmail : email
      )
    );
  }, []);

  const addNewEmailToEmailList = useCallback((newEmail: MaskedEmail) => {
    setMaskedEmails((emails) => [newEmail, ...emails]);
  }, []);

  const removeEmailFromEmailList = useCallback((emailToRemove: MaskedEmail) => {
    setMaskedEmails((emails) =>
      emails.filter((email) => email.id !== emailToRemove.id)
    );
  }, []);

  return {
    maskedEmails,
    isLoading,
    refreshMaskedEmails,
    updateEmailInList,
    addNewEmailToEmailList,
    removeEmailFromEmailList
  };
}
