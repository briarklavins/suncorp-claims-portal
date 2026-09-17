export interface Brand {
  code: string;
  displayName: string;
  cssKey: string;
  contactNumber: string;
  claimsHours: string;
  underwriter: string;
}

export const BRANDS: Brand[] = [
  {
    code: 'SUN',
    displayName: 'Suncorp Insurance',
    cssKey: 'suncorp',
    contactNumber: '13 11 55',
    claimsHours: '24 hours, 7 days',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  },
  {
    code: 'AAM',
    displayName: 'AAMI',
    cssKey: 'aami',
    contactNumber: '13 22 44',
    claimsHours: '24 hours, 7 days',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  },
  {
    code: 'GIO',
    displayName: 'GIO',
    cssKey: 'gio',
    contactNumber: '13 10 10',
    claimsHours: '24 hours, 7 days',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  },
  {
    code: 'APA',
    displayName: 'Apia',
    cssKey: 'apia',
    contactNumber: '13 50 50',
    claimsHours: 'Mon to Fri 8am - 8pm AEST',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  },
  {
    code: 'SHA',
    displayName: 'Shannons',
    cssKey: 'shannons',
    contactNumber: '13 46 46',
    claimsHours: 'Mon to Fri 8am - 7pm AEST',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  },
  {
    code: 'BIN',
    displayName: 'Bingle',
    cssKey: 'bingle',
    contactNumber: '13 24 64',
    claimsHours: 'Online only',
    underwriter: 'AAI Limited ABN 48 005 297 807'
  }
];
