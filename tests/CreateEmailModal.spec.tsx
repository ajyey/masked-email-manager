// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MaskedEmail } from 'fastmail-masked-email';

const mocks = vi.hoisted(() => ({
  createEmail: vi.fn(),
  getService: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  writeText: vi.fn()
}));

vi.mock('@src/contexts/AuthContext', () => ({
  useAuth: () => ({ getService: mocks.getService })
}));

vi.mock('react-hot-toast', () => ({
  toast: { error: mocks.toastError, success: mocks.toastSuccess }
}));

import CreateEmailModal from '../src/pages/popup/components/home/detail/modals/CreateEmailModal';
import { FILTER_OPTIONS } from '../src/pages/popup/components/home/filter/FilterOption';

const createdEmail = {
  id: 'created',
  email: 'created@example.com',
  state: 'enabled'
} as MaskedEmail;

function renderModal() {
  const props = {
    closeModal: vi.fn(),
    activeTabUrl: 'https://example.com',
    setSelectedEmail: vi.fn(),
    addNewEmailToEmailList: vi.fn(),
    setFilterOption: vi.fn()
  };
  render(<CreateEmailModal {...props} />);
  return props;
}

describe('CreateEmailModal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getService.mockResolvedValue({ createEmail: mocks.createEmail });
    mocks.createEmail.mockResolvedValue(createdEmail);
    mocks.writeText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mocks.writeText }
    });
  });

  afterEach(() => cleanup());

  it('adds, selects, copies, and closes after successful creation', async () => {
    const props = renderModal();
    expect(screen.getByRole('dialog', { name: 'Create Email' })).toBeTruthy();
    expect((screen.getByLabelText('Domain') as HTMLInputElement).value).toBe(
      'https://example.com'
    );
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Example account' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => expect(props.closeModal).toHaveBeenCalledOnce());
    expect(mocks.createEmail).toHaveBeenCalledWith({
      forDomain: 'https://example.com',
      description: 'Example account',
      state: 'enabled'
    });
    expect(props.addNewEmailToEmailList).toHaveBeenCalledWith({
      ...createdEmail,
      description: 'Example account',
      forDomain: 'https://example.com'
    });
    expect(props.setSelectedEmail).toHaveBeenCalledOnce();
    expect(props.setFilterOption).toHaveBeenCalledWith(FILTER_OPTIONS.Enabled);
    expect(mocks.writeText).toHaveBeenCalledWith(createdEmail.email);
  });

  it('keeps the modal open and restores controls after API failure', async () => {
    mocks.createEmail.mockRejectedValue(new Error('Network unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const props = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: 'Create'
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });
    expect(props.closeModal).not.toHaveBeenCalled();
    expect(props.addNewEmailToEmailList).not.toHaveBeenCalled();
    expect(mocks.toastError).toHaveBeenCalledWith(
      'Unable to create a masked email. Please try again.'
    );
  });

  it('preserves a created email when clipboard access fails', async () => {
    mocks.writeText.mockRejectedValue(new Error('Clipboard denied'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const props = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => expect(props.closeModal).toHaveBeenCalledOnce());
    expect(props.addNewEmailToEmailList).toHaveBeenCalledOnce();
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      `New email ${createdEmail.email} created!`
    );
    expect(mocks.toastError).toHaveBeenCalledWith(
      'The address could not be copied to the clipboard.'
    );
  });
});
