import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import {ClaimPage} from "../claim/claim";
import {ContactPage} from "../contacts/contact";
import {ComponentsModule} from "../../components/components.module";
import {TabMainPage} from "../main/tabMain";
import {ContractsPage} from "../contracts/contracts";
import {CreateClaimPage} from "../create/create";

@NgModule({
  declarations: [
    TabsPage,
    TabMainPage,
    ClaimPage,
    ContactPage,
    ContractsPage,
    CreateClaimPage
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    IonicPageModule.forChild(TabMainPage),
    IonicPageModule.forChild(ClaimPage),
    IonicPageModule.forChild(ContactPage),
    IonicPageModule.forChild(ContractsPage),
    IonicPageModule.forChild(CreateClaimPage),
    ComponentsModule
  ]
})
export class TabsPageModule {}
