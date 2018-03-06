import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {HubAuthUser} from "../commonTypes";
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the HubAuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HubAuthService {
  private LGM_BRAND_ID : string = '282F6365-BA55-4D8A-8CA4-1C5DB791E933';
  authUser: HubAuthUser;

  constructor(public httpClient: HttpClient) {
  }

  login(userName: string, password: string): Observable<any> {
    const data = "grant_type=password&username=" + userName + "&password=" + password + "&scope=";
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.httpClient.post<any>('account/token', data, {headers})
      .pipe(
        map((data: any) => {
          this.authUser = new HubAuthUser();
          this.authUser.access_token = data.access_token;
          this.authUser.isAuth = true;
          this.authUser.userName = data.userName;
          this.authUser.landingPage = data.landingPage;
          this.authUser.preferredLanguageCultureName = data.preferedLanguageCultureName;
          this.authUser.userProfileId = data.userProfileId;
          this.authUser.organizationProfileId = data.organizationProfileId;
          this.authUser.loggedInDealerId = data.loggedInDealerId;
          this.authUser.expires = new Date(data['.expires']);
          return this.authUser;
        })
      );
  }

  isLgmUser(): boolean {
    return this.authUser && this.authUser.organizationProfileId.toUpperCase() === this.LGM_BRAND_ID;
  }

  expired(): boolean {
    if (this.authUser && this.authUser.expires) {
      return this.authUser.expires > new Date();
    }

    return true;
  }

  logout() {
    this.authUser = null;
  }
}


