import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Contract} from "../../providers/contract-service/contract-service";
import {NgForm} from "@angular/forms";


@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreateClaimPage {
  contract: Contract;

  claim: any = {
    mileage: undefined,
    failureDate: undefined,
    repairEntryDate: undefined,
    rfContact: undefined,
    roNumber: undefined,
    customerConcern: undefined,
    causeOfFailure: undefined,
    correction: undefined
  };

  constructor(public navCtrl: NavController,
              navParams: NavParams) {
    this.contract = navParams.data as Contract;
  }

  autoFill() {
    Object.assign(this.claim, {
      repairEntryDate: new Date().toISOString(),
      rfContact: 'rf-gghhjjkk',
      roNumber: 'ro-aassddeeff',
      customerConcern: 'cc - blah',
      causeOfFailure: 'cause - blah',
      correction: 'correction - blah'
    });
  }

  takePicture() {

  }

  addClaim(form: NgForm) {
    console.log(this.claim);
  }

  ionViewDidLoad() {
    //console.log(this.contract);
  }
}
