export const environment = {
  production: false,
  envName: 'local',
  claimsApiBaseUrl: '/claims-api/v1',
  policyApiBaseUrl: '/policy-admin/api/v1',
  documentUploadUrl: '/claims-api/v1/documents',
  siteminderLoginUrl: 'https://login-dev.suncorp.com.au/siteminder/login',
  defaultBrand: 'SUN',
  googleAnalyticsId: '',
  featureToggles: {
    photoUpload: true,
    smashRepairerBooking: true,
    instantSettlement: false
  }
};
