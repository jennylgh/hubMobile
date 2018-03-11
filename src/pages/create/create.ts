import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Contract, ContractServiceProvider} from "../../providers/contract-service/contract-service";
import {NgForm} from "@angular/forms";
import {Loading} from "ionic-angular/components/loading/loading";
import {finalize} from "rxjs/operators";

import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from '@ionic-native/file';
//import {FilePath} from "@ionic-native/file-path";
import {FileTransfer, FileUploadOptions, FileTransferObject} from "@ionic-native/file-transfer";
import {HubConfigService} from "../../providers/hub-config-service/hub-config-service";
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";
import {DomSanitizer} from '@angular/platform-browser';

declare var cordova: any;

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreateClaimPage {
  contract: Contract;

  dealer: any;

  claim: any = {
    mileage: undefined,
    failureDate: undefined,
    repairEntryDate: undefined,
    rfContact: undefined,
    roNumber: undefined,
    customerConcern: undefined,
    causeOfFailure: undefined,
    correction: undefined
  };

  constructor(public navCtrl: NavController,
              public DomSanitizer: DomSanitizer,
              private _camera: Camera,
              private _loadingCtrl: LoadingController,
              private _toastCtrl: ToastController,
              private _contractService: ContractServiceProvider,
              private _alertCtrl: AlertController,
              private _file: File,
              //private _filePath: FilePath,
              private _transfer: FileTransfer,
              navParams: NavParams,
              private _configService: HubConfigService,
              private _authService: HubAuthService) {
    this.contract = navParams.data as Contract;
  }

  image: string;

  takePicture() {
    const options: CameraOptions = {
      quality: 10,
      sourceType: this._camera.PictureSourceType.CAMERA,
      destinationType: this._camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: false,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      targetWidth: 500,
      targetHeight: 500
    };

    this._camera.getPicture(options)
      .then((imagePath: string) => {
        let path, fileName;
        path = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        fileName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        console.log(`path: ${path}, fileName: ${fileName}`);

        this._file.readAsDataURL(path, fileName)
          .then((result: any) => {
            console.log('result of readAsDataURL()', result);
            this.image = result;
          }, (err: any) => {
            console.log(err);
          });
      }, (err: any) => {
        this.onError(err, 'Unable to take picture');
      });
  }

  public pathForImage(img: string) {
    if (!img) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    const url = "http://yoururl/upload.php";

    // File for Upload
    const targetPath = this.pathForImage(this.image);

    // File name only
    const filename = this.image;

    const options: FileUploadOptions = {
      httpMethod: 'POST',
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {'fileName': filename},
      headers: this.createHeaders()
    };

    const loader = this.createLoaderAndPresent();
    const fileTransfer: FileTransferObject = this._transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      loader.dismiss();
    }, (err: any) => {
      loader.dismiss();
      this.createToastAndPresent('Error uploading file');
    });
  }

  addClaim(form: NgForm) {
    if (!this.loaded) return;

    let loader: Loading = this.createLoaderAndPresent();

    this.autoFill();
    const claimDto = this.toClaimDto();

    this._contractService.addClaim(claimDto)
      .pipe(
        finalize(() => loader && loader.dismiss())
      ).subscribe((response: any) => {
        if (!response.IsSuccess) {
          this.onClaimFailure('Unable to create claim', `${response.ErrorMessages.join(' ')}`);
        } else {
          const claimId = response.Id;
          this._contractService.uploadClaimDoc({})
            .subscribe((response) => {
              this.onClaimSuccess(claimId);
            });
        }
    });
  }

  autoFill() {
    Object.assign(this.claim, {
      repairEntryDate: new Date().toISOString(),
      rfContact: 'rf- fff ggg hhh',
      roNumber: 'ro- aaa sss ddd',
      customerConcern: 'customer concerns - blah',
      causeOfFailure: 'cause - blah blah',
      correction: 'correction - blah blah blah'
    });
  }

  loaded: boolean = false;
  ionViewDidEnter() {
    let loader: Loading = this.createLoaderAndPresent();

    this._contractService.getPolicySummary(this.contract.Id)
      .pipe(
        finalize(() => loader.dismiss())
      )
      .subscribe((response: any) => {
          this.dealer = {
            dealerId: response.DealerId,
            dealerProfileId: response.DealerProfileId
          };
          this.loaded = true;

          // const imgData = `data:image/jpeg;charset=utf-8;base64,/9j/4QHPRXhpZgAATU0AKgAAAAgACAESAAMAAAABAAEAAAEQAAIAAAAKAAAAboglAAQAAAABAAABBgEAAAQAAAABAAAB9IdpAAQAAAABAAAAlAEBAAQAAAABAAABGQEyAAIAAAAUAAAAeAEPAAIAAAAIAAAAjAAAAABTTS1OOTIwVzgAMjAxODowMzoxMSAxMjozMDo0NwBzYW1zdW5nAAAHkgoABQAAAAEAAADugpoABQAAAAEAAAD2kggABAAAAAEAAAAAgp0ABQAAAAEAAAD+pAMAAwAAAAEAAAAAkgkAAwAAAAEAAAAAiCcAAwAAAAEDIAAAAAAAAAAAAa4AAABkAAAB9AAAJxAAAEo4AAAnEAAIAAcABQAAAAMAAAFsAAUAAQAAAAEAAAAAAAIABQAAAAMAAAGEAAYABQAAAAEAAAGcAB0AAgAAAAsAAAGkAAQABQAAAAMAAAGvAAEAAgAAAAJOAAAAAAMAAgAAAAJXAAAAAAAAAAAAABMAAAABAAAAHgAAAAEAAAAaAAAAAQAAADEAAAABAAAAEQAAAAEAAAAQAAAAAQAAAAgAAAABMjAxODowMzoxMQAAAAB7AAAAAQAAAAcAAAABAAAABAAAAAH/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAEZAfQDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAMBAAAgICAgEEAgMAAAQHAAAAAAECEQMxEiFBIjJRYQRxE0KBFDM0kSNScqGxwfD/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/APW+kePJK5NnpyyqB45FRlhb1YLB1NWBkhqXufd/ZkigAAAFAEZTLAgBQOq6wmDo+sUTmVFI2RujLdkVrkaUjmAOk/aZJb6RQHXwTr4KAHR2hKCgvRb/AGcTUdAJTc33peDpGeKUEsidx1RwbqQsDpknzlaVJKkjJnkO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`;
          // this.image = imgData;
        },(err: any) => {
          this.onError(err, `Error getting policy summary ${this.contract.Id}`);
      });
  }

  private onClaimSuccess(claimId: string) {
    this.createAlert('Success', `Claim ${claimId} created.`);
  }

  private onClaimFailure(title, msg: string) {
    this.createAlert(title, msg);
  }

  private onError(err: any, msg) {
    if (typeof err === 'string') {
      msg = `${msg}: ${err}`;
    }
    this.createToastAndPresent(msg);
    console.log(err);
  }

  private toClaimDto(): any {
    return {
      PolicyId: this.contract.Id,
      RepairFacilityDealerId: this.dealer.dealerId,

      CurrentOdometerUnitId: 1,
      CurrentOdometer: this.claim.mileage,
      FailureDate: this.claim.failureDate,

      CustomerConcerns: [
        {
          Id: '00000000-0000-0000-0000-000000000000',
          Reason: 'Other',
          CauseOfFailures: [
            this.get3cOther()
          ],
          Corrections: [
            this.get3cOther()
          ]
        }
      ],

      CauseOfFailure: [
        this.get3cOther()
      ],

      Correction: [
        this.get3cOther()
      ],

      CustomerConcernsOther: this.claim.customerConcern,
      CorrectionOther: this.claim.correction,
      CauseOfFailureOther: this.claim.causeOfFailure,

      HasCommercialUsageNotes: '',
      HasModificationNotes: '',

      RepairEntryDate: this.claim.repairEntryDate,
      RepairFacilityContact: 'RF contact: blah',
      RepairOrderNumber: this.claim.roNumber,
      ReportChannelId: '81069ae5-976e-4e3d-85ee-7f20a4a8291c'
    };
  }

  private get3cOther() {
    return {
      Id: '00000000-0000-0000-0000-000000000000',
      Reason: 'Other'
    };
  }

  private createLoaderAndPresent(): Loading {
    let loader = this._loadingCtrl.create({
      content: `<ion-spinner name="bubbles">Loading...</ion-spinner>`
    });

    loader.present();
    return loader;
  }

  private createToastAndPresent(msg: string) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  private createAlert(title: string, subTitle: string) {
    let alert = this._alertCtrl.create({title, subTitle, buttons: ['Dismiss']});
    alert.present();
  }

  private createHeaders(): any {
    return {
      BuildVersion: this._configService.buildKey,
      Authorization: 'Bearer ' + this._authService.authUser.access_token
    };
  }
}
