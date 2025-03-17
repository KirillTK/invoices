import { type UserCardConfig } from '~/features/user-card/ui/user-card';

export const USER_INFO_FORM_CONFIG: UserCardConfig[] = [
  { label: 'Email', name: 'email' },
  { label: 'Name', name: 'name' },
  { label: 'Country', name: 'country' },
  { label: 'City', name: 'city' },
  { label: 'Address', name: 'address' },
  { label: 'ZIP code', name: 'zip' },
];

export const USER_BUSINESS_INFO_FORM_CONFIG: UserCardConfig[] = [
  { label: 'Tax ID / NIP / VAT Number', name: 'taxIndex' },
  { label: 'Bank Account Number', name: 'bankAccount' },
];
  