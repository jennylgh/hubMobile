import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {ContractServiceProvider} from "../../providers/contract-service/contract-service";
import {HttpErrorResponse} from "@angular/common/http";

const getDefaultDate = () => {
  let date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

@Component({
  selector: 'page-contract',
  templateUrl: 'contracts.html'
})
export class ContractsPage {
  toDate: string = getDefaultDate().toISOString();

  constructor(public navCtrl: NavController,
              private _loadingCtrl: LoadingController,
              private _contractService: ContractServiceProvider) {
  }

  onSearch() {
    if (!this.toDate) return;

    let loader = this.createLoader();
    loader.present();

    const date = new Date(this.toDate); //validate date < 1 month

    this._contractService.search(date).subscribe((response: any) => {
      console.log(response);
      loader.dismiss();
    }, (err: HttpErrorResponse) => {
      loader.dismiss();
    });
  }

  private createLoader() {
    return this._loadingCtrl.create({
      content: `<ion-spinner>Loading...</ion-spinner>`
    });
  }
}
