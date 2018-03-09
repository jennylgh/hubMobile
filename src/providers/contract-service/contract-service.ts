import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

export interface Contract {
  Id: string,
  PolicyNumber: number;
  ContractDate: string;
  CustomerName: string;
  DealerName: string;
  ProductCode: string;
  Status: string;
  VehicleDesc: string;
  canAddClaim: boolean
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

  search(dateTo: Date, page: number, pageSize: number = 5): Observable<any> {
    const body: any = {
      DateRange: {
        Start: null,
        End: dateTo
      },
      DateType: "contract"
    };
    return this.http
      .post<any>(`policies/search?page=${page}&pageSize=${pageSize}&sortDirection=desc&sortField=Created`, body);
  }

  getPolicyClaimHistory(policyId: string): Observable<any> {
    return this.http.get(`claim/history/${policyId}`);
  }
}



