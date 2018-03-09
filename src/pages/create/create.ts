import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Contract} from "../../providers/contract-service/contract-service";

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreateClaimPage {
  contract: Contract;

  constructor(public navCtrl: NavController,
              navParams: NavParams) {
    this.contract = navParams.data as Contract;
  }

  ionViewDidLoad() {
    console.log(this.contract);
  }
}
