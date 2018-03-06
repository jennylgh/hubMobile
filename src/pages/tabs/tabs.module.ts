import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import {ClaimPage} from "./claim";
import {ContactPage} from "./contact";
import {ComponentsModule} from "../../components/components.module";
import {TabMainPage} from "./tabMain";

@NgModule({
  declarations: [
    TabsPage,
    TabMainPage,
    ClaimPage,
    ContactPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    IonicPageModule.forChild(TabMainPage),
    IonicPageModule.forChild(ClaimPage),
    IonicPageModule.forChild(ContactPage),
    ComponentsModule
  ]
})
export class TabsPageModule {}
