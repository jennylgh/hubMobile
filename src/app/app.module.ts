import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Camera} from '@ionic-native/camera';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ComponentsModule} from "../components/components.module";
import {HubAuthService} from '../providers/hub-auth-service/hub-auth-service';
import {HubConfigService} from "../providers/hub-config-service/hub-config-service";
import {MobileHttpInterceptor} from "../providers/mobile-http-interceptor/mobile-http-interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {ContractServiceProvider} from '../providers/contract-service/contract-service';
import {FilePath} from "@ionic-native/file-path";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    TabsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HubAuthService,
    HubConfigService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MobileHttpInterceptor,
      multi: true
    },
    ContractServiceProvider,
    File,
    FileTransfer,
    FilePath,
    Camera
  ]
})
export class AppModule {}
