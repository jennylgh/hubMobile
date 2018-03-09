import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";

@Component({
  selector: 'page-tabMain',
  templateUrl: 'tabMain.html'
})
export class TabMainPage
{
  username: string;
  rootPage: any = TabMainPage;

  constructor(public navCtrl: NavController,
              authService: HubAuthService) {
    this.username = authService.authUser.userName;
  }

}
