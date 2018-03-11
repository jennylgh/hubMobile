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
      quality: 100,
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
        //this.createAlert('ImagePath', imagePath);
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.createAlert('Image Separated', `path: ${correctPath}, name: ${currentName}`);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }, (err: any) => {
        this.onError(err, 'Unable to take picture');
      });
  }

  copyFileToLocalDir(path: string, fileName: string, newFileName: string) {
    this.createAlert('cordova', cordova.file.dataDirectory);
    this._file.copyFile(path, fileName, cordova.file.dataDirectory, newFileName)
      .then((response: any) => {
        this.image = newFileName;
        this.createAlert('Image new path', this.pathForImage(this.image));
      }, (error: any) => {
        this.onError(error, 'Error when storing file')
      })
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
        },(err: any) => {
          this.onError(err, `Error getting policy summary ${this.contract.Id}`);
      });
  }

  private createFileName(): string {
    const d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
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
