import {ErrorHandler, Injectable} from '@angular/core';

/*
  Generated class for the HubErrorHandlersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HubErrorHandlersProvider implements ErrorHandler{
  handleError(error: any): void {
    if (error) {
      console.log(JSON.stringify(error));
    }
  }

  constructor() {
  }
}
