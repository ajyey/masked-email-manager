import React from 'react';
import {
  AllIcon,
  CheckedDropdownItemIcon,
  DeletedIcon,
  DisabledIcon,
  EnabledIcon,
  FavoriteIcon
} from '@pages/popup/components/home/icons/icons';

export interface FilterOption {
  value: string;
  icon: React.ReactNode;
}

/**
 * Filter options for the dropdown
 */
export const filterDropdownOptions: FilterOption[] = [
  {
    value: 'All',
    icon: <AllIcon iconClasses={'stroke-mikado-yellow'} />
  },
  {
    value: 'Favorites',
    icon: (
      <FavoriteIcon iconClasses={'fill-mikado-yellow stroke-mikado-yellow'} />
    )
  },
  {
    value: 'Enabled',
    icon: <EnabledIcon iconClasses={'stroke-eucalyptus'} />
  },
  {
    value: 'Disabled',
    icon: <DisabledIcon iconClasses={'stroke-magnesium'} />
  },
  {
    value: 'Deleted',
    icon: <DeletedIcon iconClasses={'stroke-red-500'} />
  }
];

export const FilterOption = ({
  item,
  isSelected,
  onClick
}: {
  item: FilterOption;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <li
    className="flex items-center cursor-pointer hover:bg-french-blue/[0.8] rounded-lg p-2"
    onClick={onClick}
  >
    {item.icon}
    <span className="text-sm font-medium">{item.value}</span>
    {isSelected && (
      <CheckedDropdownItemIcon
        iconClasses={'w-4 h-4 ml-auto stroke-malibu stroke-3'}
      />
    )}
  </li>
);
