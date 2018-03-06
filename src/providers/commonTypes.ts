
export class HubAuthUser {
  isAuth: boolean;
  access_token: string;
  userName: string;
  landingPage: string;
  preferredLanguageCultureName: string;
  userProfileId: string;
  organizationProfileId: string;
  loggedInDealerId: string;
  expires: Date;
  permissions?: any;
}
