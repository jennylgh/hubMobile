import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";
import {TabsPage} from "../tabs/tabs";
import {Loading} from "ionic-angular/components/loading/loading";
import {finalize} from "rxjs/operators";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'home.html',
})
export class HomePage {
  username: string = 'omni_karen';
  password: string;// = 'Password1!';

  error: any;

  constructor(public navCtrl: NavController,
              private _loadingCtrl: LoadingController,
              private _authService: HubAuthService) {
  }

  login(form: NgForm) {
    if (!form.valid) return;

    const loader = this.createLoaderAndPresent();
    this._authService.login(this.username, this.password)
      .pipe(
        finalize(() => loader && loader.dismiss())
      )
      .subscribe((res: any) => {
        this.error = undefined;
        this.navigateToMainPage();
      }, (err: any) => {
        this.error = err.error;
      });
  }

  navigateToMainPage() {
    this.navCtrl.setRoot(TabsPage);
  }

  ionViewDidLoad() {
  }

  private createLoaderAndPresent(): Loading {
    let loader = this._loadingCtrl.create({
      content: `<ion-spinner name="bubbles">Loading...</ion-spinner>`
    });

    loader.present();
    return loader;
  }
}
