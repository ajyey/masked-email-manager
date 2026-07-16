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

vi.mock('@pages/popup/components/home/top/SettingsDropdown', () => ({
  default: () => null
}));

import Top from '../src/pages/popup/components/home/top/Top';

describe('Top', () => {
  afterEach(() => cleanup());

  it('disables refresh until the request settles', async () => {
    let finishRefresh!: () => void;
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishRefresh = resolve;
        })
    );
    render(
      <Top
        onSearchChange={vi.fn()}
        onRefresh={onRefresh}
        openLogoutConfirmationModal={vi.fn()}
        openCreateEmailModal={vi.fn()}
      />
    );

    const refreshButton = screen.getByRole('button', {
      name: 'Refresh masked emails'
    }) as HTMLButtonElement;
    fireEvent.click(refreshButton);

    expect(refreshButton.disabled).toBe(true);
    expect(onRefresh).toHaveBeenCalledOnce();

    await act(async () => finishRefresh());
    await waitFor(() => expect(refreshButton.disabled).toBe(false));
  });
});
