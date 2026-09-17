export const environment = {
  production: false,
  envName: 'uat',
  claimsApiBaseUrl: 'https://api-uat.suncorp.com.au/claims/v1',
  policyApiBaseUrl: 'https://api-uat.suncorp.com.au/policy-admin/api/v1',
  documentUploadUrl: 'https://api-uat.suncorp.com.au/claims/v1/documents',
  siteminderLoginUrl: 'https://login-uat.suncorp.com.au/siteminder/login',
  defaultBrand: 'SUN',
  googleAnalyticsId: 'UA-000000-2',
  featureToggles: {
    photoUpload: true,
    smashRepairerBooking: true,
    instantSettlement: true
  }
};
