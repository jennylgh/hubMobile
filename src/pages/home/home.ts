import {Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";
import {TabsPage} from "../tabs/tabs";

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
      password: string = 'Password1!';

      error: any;

      constructor(public navCtrl: NavController,
                  private _authService: HubAuthService) {
      }

      login(form: NgForm) {
        if (!form.valid) return;

        this._authService.login(this.username, this.password)
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

}
