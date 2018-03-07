import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {TabMainPage} from "../pages/tabs/tabMain";
import {ClaimPage} from "../pages/tabs/claim";
import {HubAuthService} from "../providers/hub-auth-service/hub-auth-service";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  @ViewChild("content") nav: NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private _authService: HubAuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  gotoMain() {
    this.nav.push(TabMainPage);
  }

  gotoClaim() {
    this.nav.push(ClaimPage);
  }

  logout() {
    this._authService.logout();
    this.nav.setRoot(HomePage);
    this.nav.popToRoot();
  }
}

