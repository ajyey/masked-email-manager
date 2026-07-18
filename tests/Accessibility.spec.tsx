// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MaskedEmail } from 'fastmail-masked-email';

import SearchBar from '../src/pages/popup/components/home/top/SearchBar';
import FilterEmailsDropdown from '../src/pages/popup/components/home/filter/FilterEmailsDropdown';
import { FILTER_OPTIONS } from '../src/pages/popup/components/home/filter/FilterOption';
import EmailItem from '../src/pages/popup/components/home/emails/EmailItem';
import FavoriteButton from '../src/pages/popup/components/home/detail/buttons/FavoriteButton';
import EmailStateToggle from '../src/pages/popup/components/home/detail/buttons/EmailStateToggle';
import LogoutConfirmationModal from '../src/pages/popup/components/home/detail/modals/LogoutConfirmationModal';
import PermanentDeleteConfirmationModal from '../src/pages/popup/components/home/detail/modals/PermanentDeleteConfirmationModal';

const email = {
  id: 'alpha',
  email: 'alpha@example.com',
  description: 'Alpha account',
  state: 'enabled'
} as MaskedEmail;

describe('popup accessibility contracts', () => {
  afterEach(() => cleanup());

  it('labels search and supports an accessible clear action', () => {
    const onSearchChange = vi.fn();
    render(<SearchBar onSearchChange={onSearchChange} />);

    fireEvent.change(screen.getByLabelText('Search masked emails'), {
      target: { value: 'alpha' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onSearchChange).toHaveBeenLastCalledWith('');
  });

  it('exposes filter options as a keyboard-selectable listbox', () => {
    const setFilterOption = vi.fn();
    render(
      <FilterEmailsDropdown
        filterOption={FILTER_OPTIONS.All}
        setFilterOption={setFilterOption}
      />
    );

    const trigger = screen.getByRole('button', {
      name: 'Filter masked emails: All'
    });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const listbox = screen.getByRole('listbox', {
      name: 'Masked email filter'
    });
    const favorites = within(listbox).getByRole('option', {
      name: 'Favorites'
    });
    fireEvent.keyDown(favorites, { key: 'Enter' });

    expect(setFilterOption).toHaveBeenCalledWith(FILTER_OPTIONS.Favorites);
  });

  it('exposes selectable email rows and their state', () => {
    const onClick = vi.fn();
    render(
      <ul role="listbox" aria-label="Masked emails">
        <EmailItem maskedEmail={email} isSelected={true} onClick={onClick} />
      </ul>
    );

    const option = screen.getByRole('option', {
      name: 'alpha@example.com, enabled'
    });
    expect(option.getAttribute('aria-selected')).toBe('true');
    expect(option.tagName).toBe('BUTTON');
    fireEvent.click(option);
    expect(onClick).toHaveBeenCalledWith(email);
  });

  it('exposes favorite and state values through control attributes', () => {
    render(
      <>
        <FavoriteButton isFavorited={true} onClick={vi.fn()} />
        <EmailStateToggle emailState="deleted" onEmailStateChange={vi.fn()} />
      </>
    );

    const favorite = screen.getByRole('button', {
      name: 'Remove from favorites'
    });
    expect(favorite.getAttribute('aria-pressed')).toBe('true');
    expect(
      (screen.getByLabelText('Masked email enabled') as HTMLInputElement)
        .disabled
    ).toBe(true);
  });

  it('names and scopes confirmation dialogs', () => {
    const { rerender } = render(
      <LogoutConfirmationModal closeModal={vi.fn()} logout={vi.fn()} />
    );
    expect(screen.getByRole('dialog', { name: 'Logout' })).toBeTruthy();

    rerender(
      <PermanentDeleteConfirmationModal
        closeModal={vi.fn()}
        handlePermanentDelete={vi.fn()}
        selectedEmail={email}
      />
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Permanently Delete Email'
    });
    expect(
      within(dialog).getByRole('button', { name: 'Permanently delete' })
    ).toBeTruthy();
  });
});
