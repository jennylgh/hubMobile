import { Component } from '@angular/core';
import {InfiniteScroll, LoadingController, NavController, ToastController} from 'ionic-angular';
import {Contract, ContractServiceProvider} from "../../providers/contract-service/contract-service";
import {HttpErrorResponse} from "@angular/common/http";
import {CreateClaimPage} from "../create/create";
import {Loading} from "ionic-angular/components/loading/loading";
import {finalize} from "rxjs/operators";

const getDefaultDate = () => {
  let date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

@Component({
  selector: 'page-contracts',
  templateUrl: 'contracts.html'
})
export class ContractsPage {
  toDate: string = getDefaultDate().toISOString();

  constructor(public navCtrl: NavController,
              private _loadingCtrl: LoadingController,
              private _toastCtrl: ToastController,
              private _contractService: ContractServiceProvider) {
  }

  private _pageSize: number = 5;
  private _page: number;
  private _ended: boolean;
  private _contracts: Array<Contract>;

  private _showLoader: boolean;
  onSearch() {
    if (!this.toDate) return;

    this._page = 1;
    this._ended = false;
    this._contracts = [];
    this._showLoader = true;

    this.search();
  }

  scroll(infiniteScroll: InfiniteScroll) {
    this._page++;
    this._showLoader = false;
    this.search(infiniteScroll);
  }

  addClaim(c: Contract) {
    if (!c.canAddClaim) return;

    this.navCtrl.push(CreateClaimPage, c);
  }

  private search(infiniteScroll?: InfiniteScroll) {
    let loader: Loading;
    if (this._showLoader) {
      loader = this.createLoader();
      loader.present();
    }

    const date = new Date(this.toDate); //validate date < 1 month

    this._contractService.search(date, this._page, this._pageSize)
      .pipe(
        finalize(() => {
          infiniteScroll && infiniteScroll.complete();
          loader && loader.dismiss();
        })
      )
      .subscribe((response: any) => {
        this._ended = response.Items.length < this._pageSize;

        const formatted = response.Items.map(this.toContract.bind(this));
        this._contracts.push(...formatted);
      }, (err: HttpErrorResponse) => {
        this.createToastAndPresent('Error searching contract');
      });
  }

  private toContract(item: any): Contract {
    const pName = (item.ProductName || '').toLowerCase();
    const inforce = item.Status.toLowerCase() === 'inforce';
    const contract = {
      Id: item.Id,
      PolicyNumber: item.FriendlyId,
      ContractDate: (item.ContractDate || '').substring(0, 10),
      CustomerName: `${item.FirstName} ${item.LastName}`,
      DealerName: item.AccountName,
      ProductCode: item.ProductName,
      Status: item.Status,
      VehicleDesc: item.Vehicle,
      canAddClaim: pName.indexOf('loan') < 0 && pName.indexOf('excess wear') < 0 && inforce
    };
    return contract as Contract;
  }

  private createLoader(): Loading {
    return this._loadingCtrl.create({
      content: `<ion-spinner name="ios">Loading...</ion-spinner>`
    });
  }

  private createToastAndPresent(msg: string) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }
}
