import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Contract, ContractServiceProvider} from "../../providers/contract-service/contract-service";
import {NgForm} from "@angular/forms";
import {Loading} from "ionic-angular/components/loading/loading";
import {finalize} from "rxjs/operators";

import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult} from "@ionic-native/file-transfer";
import {HubConfigService} from "../../providers/hub-config-service/hub-config-service";
import {HubAuthService} from "../../providers/hub-auth-service/hub-auth-service";
import {DomSanitizer} from '@angular/platform-browser';

import '@ionic-native/device';

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
              private _transfer: FileTransfer,
              navParams: NavParams,
              private _configService: HubConfigService,
              private _authService: HubAuthService) {
    this.contract = navParams.data as Contract;
  }

  image: string;  //base64 blob
  imageUri: string;

  takePicture() {
    const options: CameraOptions = {
      quality: 30,
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

        this.imageUri = imagePath;
        this._file.readAsDataURL(path, fileName)
          .then((result: any) => {
            this.image = result;
          }, (err: any) => {
            this.onError(err, 'Unable to read file content');
          });
      }, (err: any) => {
        this.onError(err, 'Unable to take picture');
      });
  }

  private getClaimFileCategories(): any {
    return `[{"CategoryName":"Claim Documents","FileTypes":[{"Id":"cbf450b2-a190-e611-80e0-0050568a57d5","Extension":".m4a","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"6bac5fb8-a190-e611-80e0-0050568a57d5","Extension":".xls","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"d40cd1ce-a190-e611-80e0-0050568a57d5","Extension":".zip","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"83d4947e-cc90-e611-80e0-0050568a57d5","Extension":".mp4","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"71bf3464-999b-e611-80e0-0050568a57d5","Extension":".jpeg","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"35d3fb85-999b-e611-80e0-0050568a57d5","Extension":".msg","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"e652f62d-ee55-e711-80e0-0050568a57d5","Extension":".avi","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"deb468b3-25fa-e711-80e9-0050568a57d5","Extension":".3gp","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"990b04f8-30b3-470a-a90c-0bc0a0d31ee6","Extension":".csv","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"4c1c796f-8d06-42b5-99d5-10f079eeb1aa","Extension":".mpeg","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"61502d29-fbb5-4399-a3ec-236b096829f4","Extension":".mpg","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"ca7087d1-3fdd-4898-956c-3a6f4ef87af0","Extension":".tif","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"65f0899f-5e57-4ec8-a202-3b88e06ba1e2","Extension":".png","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"a33ec880-9d65-4262-8858-490f341a2060","Extension":".wma","MaximumFileSize":20971520,"CanBeDeleted":false},{"Id":"451696ad-e1db-4030-84d8-545b14b473e9","Extension":".doc","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"a5c6a3a9-6aa5-48c9-a436-55f7d710be8d","Extension":".bmp","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"eef9c37b-5789-4154-9ff5-7b179e9f25b4","Extension":".jpg","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"367a53f6-c9b0-436b-beef-7f6b3a6b0d07","Extension":".rtf","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"f03d9430-9518-427c-bbc2-889410567aad","Extension":".wav","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"135350ad-5891-4ae1-ba1b-93e5ee125f15","Extension":".pdf","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"e613d63f-641d-494e-90b8-a99e1d03539f","Extension":".html","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"bc679969-e523-496c-b5ce-b2ffa0fb408a","Extension":".gif","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"b8e1040e-5289-4c6e-bdee-d3d57f0f7778","Extension":".mov","MaximumFileSize":52428800,"CanBeDeleted":false},{"Id":"732d8d1d-b0ca-4126-95cd-d776d953b1d0","Extension":".docx","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"e3763729-6386-449f-97b6-e92be6c93e19","Extension":".ppt","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"cd3ee1b3-a398-44cb-a36d-ea26f28a7ed1","Extension":".tiff","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"ffd357e4-eb35-41d0-a507-ef23a49d9a96","Extension":".xlsx","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"b77dd90f-34f3-4b19-8097-ef6e1022f741","Extension":".txt","MaximumFileSize":10485760,"CanBeDeleted":false},{"Id":"e74685cb-4a5d-44d1-bd87-f6fb5f4a94f6","Extension":".pptx","MaximumFileSize":10485760,"CanBeDeleted":false}],"Id":"a9894271-1d92-4bd5-bbe8-d2c606c3e4a2","IsPublicAccessAllowed":false}]`;
  }

  public uploadImage(params: any): Promise<FileUploadResult> {
    if (!this.image || !this.imageUri) return;

    const url = this.getUploadUrl();

    // File for Upload
    const targetFile = this.imageUri;
    const fileName = targetFile.substr(targetFile.lastIndexOf('/') + 1);

    const options: FileUploadOptions = {
      httpMethod: 'POST',
      fileKey: "file",
      fileName: fileName,
      chunkedMode: true,
      mimeType: "multipart/form-data",
      params: params,
      headers: this.createHeaders()
    };

    //console.log('About to upload file', JSON.stringify(options));

    const fileTransfer: FileTransferObject = this._transfer.create();
    return fileTransfer.upload(targetFile, url, options);
  }

  addClaim(form: NgForm) {
    if (!this.loaded) return;

    let loader: Loading = this.createLoaderAndPresent();

    this.autoFill();
    const claimDto = this.toClaimDto();

    const doUpload = true;
    this._contractService.addClaim(claimDto)
      .pipe(
        finalize(() => loader && loader.dismiss())
      ).subscribe((response: any) => {
        if (!response.IsSuccess) {
          this.onClaimFailure('Unable to create claim', `${response.ErrorMessages.join(' ')}`);
        } else {
          const claimId: string = response.Id;
          if (doUpload && this.image && this.imageUri) {
            this.upload(claimId, loader);
          } else {
            this.onClaimSuccess(claimId, false);
          }
        }
    }, (err: any) => {
        this.onError(err, 'Unable to addClaim', loader);
    });
  }

  private upload(claimId: string, loader: Loading) {
    const params: any = {
      Object: JSON.stringify({ObjectId: claimId}),
      FileDescription: 'claim file upload - mobile',
      FileCategories: this.getClaimFileCategories()
    };

    this.uploadImage(params).then((response: any) => {
      loader && loader.dismissAll();
      this.onClaimSuccess(claimId, true);
    }, (err: any) => {
      this.onError(err, `Added Claim ${claimId}. But unable to upload picture`, loader);
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

  private onClaimSuccess(claimId: string, imageUploaded: boolean = true) {
    let msg = `Claim ${claimId} created`;
    if (imageUploaded) {
      msg += ', image uploaded';
    }

    this.createAlert('Success', msg)
      .then(() => {
        this.navCtrl.pop();
      });
  }

  private onClaimFailure(title, msg: string) {
    this.createAlert(title, msg);
  }

  private onError(err: any, msg: string, loader?: Loading) {
    loader && loader.dismissAll();

    if (typeof err === 'string') {
      msg = `${msg}: ${err}`;
    }

    this.createToastAndPresent(msg, JSON.stringify(err));
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
      ReportChannelId: '95A99887-D3E6-4728-BDE8-8AB96CF42F25'
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

  private createToastAndPresent(msg: string, err?: any) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
    console.log(msg, err);
  }

  private createAlert(title: string, subTitle: string): Promise<any> {
    let alert = this._alertCtrl.create({title, subTitle, buttons: ['Dismiss']});
    return alert.present();
  }

  private getUploadUrl() {
    return `${this._configService.hubApiRoot}/api/file`
  }

  private createHeaders(): any {
    return {
      BuildVersion: this._configService.buildKey,
      Authorization: 'Bearer ' + this._authService.authUser.access_token
    };
  }
}
