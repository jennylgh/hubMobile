import { Injectable } from '@angular/core';

/*
  Generated class for the HubConfigServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HubConfigService {
  constructor() {
  }

  private _connectToLocal: boolean = true;
  get hubApiRoot(): string {
    return this._connectToLocal? `http://lgmdevwks37.lgmdev.internal:7000` : `http://lgmdev-qa2.lgmdev.internal:9000`;
  }

  get buildKey(): string {
    return '{version}';
  }
}
