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

  get hubApiRoot(): string {
    return `http://lgmdev-qa2.lgmdev.internal:9000`;
  }

  get buildKey(): string {
    return '{version}';
  }
}
