import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {DateTime} from "ionic-angular";

export class Contract {
  PolicyNumber: number;
  SalesDate: Date;
  CustomerName: string;
  DealerName: string;
  ProductCode: string;
  Status: string;
  VehicleDesc: string;
}

/*
  Generated class for the ContractServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContractServiceProvider {

  constructor(public http: HttpClient) {
  }

  search(dateTo: Date, pageSize: number = 5): Observable<Array<any>> {
    const body: any = {
      DateRange: {
        Start: null,
        End: dateTo
      },
      DateType: "contract"
    };
    return this.http
      .post<Array<any>>(`policies/search?page=1&pageSize=${pageSize}&sortDirection=desc&sortField=Created`, body);
  }
}



