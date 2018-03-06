import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";

@Component({
  selector: 'page-contact',
  templateUrl: 'tabMain.html'
})
export class TabMainPage
{
  username: string;

  constructor(public navCtrl: NavController,
              private _authService: HubAuthService) {
    this.username = _authService.authUser.userName;
  }

}
