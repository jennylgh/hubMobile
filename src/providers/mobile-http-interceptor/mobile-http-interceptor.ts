import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {HubConfigService} from "../hub-config-service/hub-config-service";
import {Observable} from "rxjs/Observable";
import {catchError} from "rxjs/operators";
import {_throw} from "rxjs/observable/throw";
import {HubAuthUser} from "../commonTypes";
import {HubAuthService} from "../hub-auth-service/hub-auth-service";

/*
  Generated class for the MobileHttpInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MobileHttpInterceptor implements HttpInterceptor {
  private _apiRoot: string;
  private _buildKey: string;
  private _hubAuthService: HubAuthService;

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._hubAuthService) {
      this._hubAuthService = this.injector.get(HubAuthService);

      const configService = this.injector.get(HubConfigService);
      this._apiRoot = configService.hubApiRoot;
      this._buildKey = configService.buildKey;
    }

    let requestUrl = this.getUrl(req.url);

    let request: HttpRequest<any> = this.updateHttpRequest(req, false, requestUrl);

    return next.handle(request)
      .pipe(
        catchError((errorResponse: any) => {
          this.handleResponseError(errorResponse, req.url, false, req.responseType);
          return _throw(errorResponse);
        })
      );
  }

  private handleResponseError(err: any, url: string, suppressError: boolean, responseType: string) {
    console.log(JSON.stringify(err));
  }

  private updateHttpRequest(req: HttpRequest<any>, cacheEnabled: boolean, url: string): HttpRequest<any> {
    let headers = req.headers;

    const authToken = this.getHubAuthToken();
    if (authToken) {
      headers = headers.append('Authorization', authToken);
    }

    const buildVersion = this.getUiVersion();
    if (buildVersion) {
      headers = headers.append('BuildVersion', buildVersion);
    }

    const lang = this.getLanguageSettings();
    if (lang) {
      headers = headers.append('Selected-Language', lang);
    }

    if (req.method === 'GET') {
      headers = headers.set('Cache-Control', 'no-cache');
      headers = headers.set('Pragma', 'no-cache');
    }

    return req.clone({headers, url});
  }

  private getLanguageSettings(): string {
    return 'en-CA';
  }

  private getUiVersion(): string {
    return this._buildKey;
  }

  private getHubAuthToken(): string {
    const hubUser: HubAuthUser = this._hubAuthService.authUser;
    if (hubUser) {
      return 'Bearer ' + hubUser.access_token;
    }

    return undefined;
  }

  private getUrl(url: string): string {
    let apiUrl: string = url;
    if (apiUrl.indexOf(this._apiRoot) !== 0) {
      if (apiUrl.indexOf('/') !== 0) {
        apiUrl = '/' + apiUrl;
      }
      apiUrl = this._apiRoot + apiUrl;
    }
    return apiUrl;
  }
}
