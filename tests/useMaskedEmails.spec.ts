// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MaskedEmail } from 'fastmail-masked-email';

const mocks = vi.hoisted(() => ({
  getAllEmails: vi.fn<() => Promise<MaskedEmail[]>>(),
  getService: vi.fn(),
  toastError: vi.fn()
}));

vi.mock('@src/contexts/AuthContext', () => ({
  useAuth: () => ({ getService: mocks.getService })
}));

vi.mock('react-hot-toast', () => ({
  toast: { error: mocks.toastError }
}));

import useMaskedEmails from '../src/pages/popup/hooks/useMaskedEmails';

const firstEmail = { id: 'first', email: 'first@example.com' } as MaskedEmail;
const secondEmail = {
  id: 'second',
  email: 'second@example.com'
} as MaskedEmail;

describe('useMaskedEmails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getService.mockResolvedValue({ getAllEmails: mocks.getAllEmails });
    mocks.getAllEmails.mockResolvedValue([firstEmail]);
  });

  it('loads emails and applies local list mutations', async () => {
    const { result } = renderHook(() => useMaskedEmails());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.maskedEmails).toEqual([firstEmail]);

    act(() => result.current.addNewEmailToEmailList(secondEmail));
    expect(result.current.maskedEmails).toEqual([secondEmail, firstEmail]);

    const updatedEmail = { ...firstEmail, description: 'Updated' };
    act(() => result.current.updateEmailInList(updatedEmail));
    expect(result.current.maskedEmails).toEqual([secondEmail, updatedEmail]);

    act(() => result.current.removeEmailFromEmailList(secondEmail));
    expect(result.current.maskedEmails).toEqual([updatedEmail]);
  });

  it('reports loading failures and always clears the loading state', async () => {
    const error = new Error('Network unavailable');
    mocks.getAllEmails.mockRejectedValue(error);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const { result } = renderHook(() => useMaskedEmails());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.maskedEmails).toEqual([]);
    expect(mocks.toastError).toHaveBeenCalledWith(
      'Unable to load masked emails. Please try again.'
    );
  });
});
