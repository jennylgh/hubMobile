import { NgModule } from '@angular/core';
import { HubFooterComponent } from './hub-footer/hub-footer';
import {IonicModule} from "ionic-angular";

@NgModule({
	declarations: [HubFooterComponent],
	imports: [
    IonicModule.forRoot(ComponentsModule)
  ],
	exports: [HubFooterComponent],
  entryComponents:[

  ]
})
export class ComponentsModule {}
