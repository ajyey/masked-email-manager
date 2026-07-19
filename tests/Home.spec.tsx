// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  queryTabs: vi.fn()
}));

vi.mock('webextension-polyfill', () => ({
  default: { tabs: { query: mocks.queryTabs } }
}));
vi.mock('../utils/storageUtil', () => ({
  getDefaultFilter: vi.fn().mockResolvedValue({ value: 'All', icon: null }),
  setDefaultFilter: vi.fn()
}));
vi.mock('@pages/popup/hooks/useMaskedEmails', () => ({
  default: () => ({
    maskedEmails: [],
    isLoading: false,
    refreshMaskedEmails: vi.fn(),
    updateEmailInList: vi.fn(),
    addNewEmailToEmailList: vi.fn(),
    removeEmailFromEmailList: vi.fn()
  })
}));
vi.mock('@pages/popup/components/home/top/Top', () => ({
  default: ({ openCreateEmailModal }: { openCreateEmailModal: () => void }) => (
    <button onClick={openCreateEmailModal}>Open create</button>
  )
}));
vi.mock('@pages/popup/components/home/filter/FilterEmailsDropdown', () => ({
  default: () => null
}));
vi.mock('@pages/popup/components/home/emails/EmailCount', () => ({
  default: () => null
}));
vi.mock('@pages/popup/components/home/emails/EmailList', () => ({
  default: () => null
}));
vi.mock('@pages/popup/components/home/detail/EmailDetailPane', () => ({
  default: () => null
}));
vi.mock(
  '@pages/popup/components/home/detail/modals/LogoutConfirmationModal',
  () => ({ default: () => null })
);
vi.mock('@pages/popup/components/home/detail/modals/CreateEmailModal', () => ({
  default: ({ activeTabUrl }: { activeTabUrl: string }) => (
    <div>Active tab: {activeTabUrl}</div>
  )
}));
vi.mock('react-hot-toast', () => ({ Toaster: () => null }));

import Home from '../src/pages/popup/components/home/Home';

describe('Home', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('passes the complete active tab URL to the create dialog', async () => {
    mocks.queryTabs.mockResolvedValue([
      { url: 'https://example.com/account?source=test#section' }
    ]);
    render(<Home onLogout={vi.fn()} />);

    await waitFor(() => expect(mocks.queryTabs).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole('button', { name: 'Open create' }));

    expect(
      screen.getByText(
        'Active tab: https://example.com/account?source=test#section'
      )
    ).toBeTruthy();
    expect(mocks.queryTabs).toHaveBeenCalledWith({
      active: true,
      lastFocusedWindow: true
    });
  });
});
