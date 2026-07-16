// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const toastError = vi.hoisted(() => vi.fn());

vi.mock('react-hot-toast', () => ({
  toast: { error: toastError },
  Toaster: () => null
}));

import Login from '../src/pages/popup/components/login/Login';

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe('Login', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('prevents duplicate submissions while authentication is pending', async () => {
    const request = deferred();
    const onLoginSuccess = vi.fn(() => request.promise);
    render(<Login onLoginSuccess={onLoginSuccess} />);

    fireEvent.change(screen.getByLabelText('Fastmail API Token'), {
      target: { value: 'api-token' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Authenticate' }));

    const pendingButton = screen.getByRole('button', {
      name: 'Authenticating...'
    }) as HTMLButtonElement;
    expect(pendingButton.disabled).toBe(true);
    expect(onLoginSuccess).toHaveBeenCalledOnce();
    expect(onLoginSuccess).toHaveBeenCalledWith('api-token');

    await act(async () => request.resolve());
  });

  it('restores the form and reports authentication failures', async () => {
    const request = deferred();
    render(<Login onLoginSuccess={() => request.promise} />);

    fireEvent.change(screen.getByLabelText('Fastmail API Token'), {
      target: { value: 'invalid-token' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Authenticate' }));
    await act(async () => request.reject(new Error('Unauthorized')));

    await waitFor(() => {
      const button = screen.getByRole('button', {
        name: 'Authenticate'
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });
    expect(toastError).toHaveBeenCalledOnce();
  });
});
