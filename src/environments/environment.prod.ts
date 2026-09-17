export const environment = {
  production: true,
  envName: 'prod',
  claimsApiBaseUrl: 'https://api.suncorp.com.au/claims/v1',
  policyApiBaseUrl: 'https://api.suncorp.com.au/policy-admin/api/v1',
  documentUploadUrl: 'https://api.suncorp.com.au/claims/v1/documents',
  siteminderLoginUrl: 'https://login.suncorp.com.au/siteminder/login',
  defaultBrand: 'SUN',
  googleAnalyticsId: 'UA-000000-1',
  featureToggles: {
    photoUpload: true,
    smashRepairerBooking: true,
    instantSettlement: false
  }
};
