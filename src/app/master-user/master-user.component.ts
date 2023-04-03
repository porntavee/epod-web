import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog, GroupUserDialog, RouteDialog, ShipToDialog, VehicleDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';

@Component({
  selector: 'app-master-user',
  templateUrl: './master-user.component.html',
  styleUrls: ['./master-user.component.css']
})
export class MasterUserComponent implements OnInit, AfterContentChecked {

  isDebugMode     : boolean = true;
  isMainPage      : boolean = true;
  isFormPage      : boolean = false;
  isTimeSheetPage : boolean = false;
  headerModel     : any     = {};
  criteriaModel   : any     = {}; //ค้นหา
  criteria        : any     = {}; // User Information.
  model           : any     = {}; //ข้อมูล Form
  listModel       : any     = []; //ข้อมูลในตารางหน้า Main
  viewModel       : any     = {};
  listTransport   : any     = [];
  currentPage     : number  = 1;

  constructor(
    public dialog                  : MatDialog,
    private spinner                : NgxSpinnerService,
    private toastr                 : ToastrService,
    private changeDetector         : ChangeDetectorRef,
    private serviceProviderService : ServiceProviderService
  ){
    // Initialize userinformation to criteria object.
    this.criteria = { 
      "userinformation": this.serviceProviderService.userinformation
    };
  }

  ngOnInit(): void {
    this.render();
    this.readTransport();
  }

  // Grid configuration and render.
	render(): void {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;

    let criteria = {
      "UserName": this.criteriaModel.UserName,
      "FirstName": this.criteriaModel.FirstName,
      "LastName": this.criteriaModel.LastName,
      "Mobile": this.criteriaModel.Mobile,
      "GroupCode": this.criteriaModel.GroupCode,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-user', 'read', criteria, this.isDebugMode)

    this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
  }
  private setModel(model) {
    // Set model.
    let _model: any = model;
    for (const key in model) {
      _model[key] = model[key];
    }

    return _model;
  }

  // If can't load data to list model.
  private loadDataFalse(message): boolean {
    let _listModel: any = [];
    this.showErrorMessage(message);

    return _listModel;
  }

  // If sucess load data.
  private hideSninnerAndShowSuccess(message: string) {
    this.spinner.hide();
    this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // If error load data.
  private showErrorMessage(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // Set go to form page.
  private goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  readTransport() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria).subscribe(data => {
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listTransport = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
  }

  setFormData(param) {
    this.spinner.show();

    let _criteria = {
      "Id": param.Id
    }
    _criteria = {...this.criteria, ..._criteria};

    let _headerModel = {
      Operation: 'UPDATE'
    }
    _headerModel = {...param, ..._headerModel};

    // Setting header model.
    this.headerModel = this.setModel(_headerModel);

     // Set to from page.
     this.goToFromPage();
  }

  //Group User.
  chooseGroupUser() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(GroupUserDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'กลุ่มผู้ใช้งานระบบ' }
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-user', 'chooseGroupUser', result, this.isDebugMode)

      if (result != undefined) {
        this.criteriaModel.GroupCode = result.Code;
        this.criteriaModel.GroupName = result.GroupName;
      } else {
        this.criteriaModel.GroupCode = '';
        this.criteriaModel.GroupName = '';
      }
    });
  }

  chooseGroupUserDetail() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(GroupUserDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'กลุ่มผู้ใช้งานระบบ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.GroupCode = result.Code;
        this.headerModel.GroupName = result.GroupName;
      } else {
        this.headerModel.GroupCode = '';
        this.headerModel.GroupName = '';
      }
    });
  }

  chooseVehicleDetail() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ทะเบียนรถ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.VehicleId = result.Id;
        this.headerModel.VehicleNo = result.Description;
      } else {
        this.headerModel.VehicleId = '';
        this.headerModel.VehicleNo = '';
      }
    });
  }

  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = { apptDate: ''};
    Logger.info('master-vehicle', 'clear', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  addForm() {
    // Show spinner.
    this.spinner.show();

     // Declare setting local header model.
     let _headerModel = { 
      Operation: 'INSERT', Code : 'Auto', FirstName : '', LastName : '',
      UserName: '', Password: '', LicenseNo: '', Mobile: '', Email: '',
      Sex: '', Active: 'Y',
      //Popup
      GroupCode: '', GroupName: '', VehicleId: '', VehicleNo: '', HubId: '',
      HubCode : '', HubDescription : '', TransportId : '', TransportCode: '',
      TransportDescription : ''
    }

    // Setting header model.
    this.headerModel = this.setModel(_headerModel);

    // Set to from page.
    this.goToFromPage();
  }

  // Set back to main page.
  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  chooseTransportShipTo() {
    const dialogRef = this.dialog.open(ShipToDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'สถานที่',IsHub :'Y' }
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-user', 'chooseTransportShipTo', this.criteria, this.isDebugMode)

      if (result != undefined) {

         // Declare setting local criteria model.
         let _headerModel = {
          'HubId'          : result.Id,
          'HubCode'        : result.Code,
          'HubDescription' : result.Code + ' - ' + result.CustomerName
        }
        // Setting header model.
        _headerModel = this.setModel(_headerModel);
        this.headerModel = {...this.headerModel, ..._headerModel};
      }
    });
  }
  chooseTransport() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Transport',
        listData: this.listTransport,
        listDataSearch: this.listTransport 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // Declare setting local criteria model.
        let _headerModel = {
          'TransportId'          : result.Id,
          'TransportCode'        : result.Code,
          'TransportDescription' : result.Code + ' - ' + result.Description
        }
        // Setting header model.
        _headerModel = this.setModel(_headerModel);
        this.headerModel = {...this.headerModel, ..._headerModel};
      }
    });
  }
  save() {
    // Show spinner.
    this.spinner.show();

    let criteria = {
      'Operation'     : this.headerModel.Operation,
      'Id'            : this.headerModel.Id,
      'Code'          : this.headerModel.Code,
      'FirstName'     : this.headerModel.FirstName,
      'LastName'      : this.headerModel.LastName,
      'UserName'      : this.headerModel.UserName,
      'Password'      : this.headerModel.Password,
      'GroupCode'     : this.headerModel.GroupCode,
      'NationalityID' : this.headerModel.NationalityID,
      'VehicleId'     : this.headerModel.VehicleId,
      'LicenseNo'     : this.headerModel.LicenseNo,
      'Mobile'        : this.headerModel.Mobile,
      'Email'         : this.headerModel.Email,
      'Sex'           : this.headerModel.Sex,
      'Active'        : this.headerModel.Active,
      'HubId'         : this.headerModel.HubId,
      'TransportId'   : this.headerModel.TransportId,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveUser', criteria).subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      if (model.Status) {
        this.hideSninnerAndShowSuccess('บันทึกยกเลิกเสร็จสิ้น');
        this.backToMainPage();
      }
      else {
        this.showErrorMessage(model.Message);
      }

    }, err => {
      this.spinner.hide();
      this.showErrorMessage(err.message);
    });
  }

  delete(param) {

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?'} 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-user', 'delete', result, this.isDebugMode)

      if (result) {
         this.spinner.show();

        let criteria = {
          'Operation': 'DELETE',
          'Id': param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/DeleteUser', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = data;

          this.viewModel = model;
          if (model.Status) {
            this.hideSninnerAndShowSuccess('เสร็จสิ้น');
            this.backToMainPage();
          }
          else {
            this.spinner.hide();
            this.showErrorMessage(model.Message);
          }
        }, err => {
          this.showErrorMessage(err.message);
        });

        // Clear criteriaModel and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}
