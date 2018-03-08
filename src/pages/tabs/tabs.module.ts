import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import {ClaimPage} from "../claim/claim";
import {ContactPage} from "../contacts/contact";
import {ComponentsModule} from "../../components/components.module";
import {TabMainPage} from "../main/tabMain";
import {ContractsPage} from "../contracts/contracts";

@NgModule({
  declarations: [
    TabsPage,
    TabMainPage,
    ClaimPage,
    ContactPage,
    ContractsPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    IonicPageModule.forChild(TabMainPage),
    IonicPageModule.forChild(ClaimPage),
    IonicPageModule.forChild(ContactPage),
    IonicPageModule.forChild(ContractsPage),
    ComponentsModule
  ]
})
export class TabsPageModule {}
