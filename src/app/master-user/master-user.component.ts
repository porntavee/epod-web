import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog, GroupUserDialog, RouteDialog, ShipToDialog, VehicleDialog } from '../dialog/dialog';

@Component({
  selector: 'app-master-user',
  templateUrl: './master-user.component.html',
  styleUrls: ['./master-user.component.css']
})
export class MasterUserComponent implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [];
  headerModel: any = {};
  criteriaModel: any = {} //ค้นหา
  title: string = 'เพิ่มข้อมูล';
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  dateControl = new FormControl(moment().format('YYYYMMDD'));
  listTransport: any = [];
  mode: any = 'create';

  p = 1;

  listGroupUser: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.read();
    this.readTransport();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "UserName": this.criteriaModel.UserName,
      "FirstName": this.criteriaModel.FirstName,
      "LastName": this.criteriaModel.LastName,
      "Mobile": this.criteriaModel.Mobile,
      "GroupCode": this.criteriaModel.GroupCode,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listModel = model.Data;
      }
      else {
        this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readTransport() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listTransport = model.Data;
      }
      else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Id": param.Id
    }

    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();

    // let json = JSON.stringify(criteria);

    // this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
    //   this.spinner.hide();
    //   let model: any = {};
    //   model = data;
    //   this.viewModel = model;

    //   if (model.Status) {

    //     this.listDetailModel = model.Data;

    //     this.isMainPage = false;
    //     this.isFormPage = true;
    //   }
    //   else {
    //     this.spinner.hide();
    //     this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //   }

    // }, err => {
    //   this.spinner.hide();
    //   this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    // });
  }

  //Group User.
  chooseGroupUser() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(GroupUserDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'กลุ่มผู้ใช้งานระบบ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.GroupCode = result.Code;
        this.criteriaModel.GroupName = result.GroupName;
      }
      else {
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
      }
      else {
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
      }
      else {
        this.headerModel.VehicleId = '';
        this.headerModel.VehicleNo = '';
      }
    });
  }

  clear() {
    this.criteriaModel = { apptDate: '' };
  }

  add() {
    this.spinner.show();
    this.headerModel.Operation = 'INSERT';
    this.headerModel.Code = 'Auto';
    this.headerModel.FirstName = '';
    this.headerModel.LastName = '';
    this.headerModel.UserName = '';
    this.headerModel.Password = '';
    this.headerModel.LicenseNo = '';
  
    this.headerModel.Mobile = '';
    this.headerModel.Email = '';
    this.headerModel.Sex = '';
    this.headerModel.Active = 'Y';

    //Popup
    this.headerModel.GroupCode = '';
    this.headerModel.GroupName = '';

    this.headerModel.VehicleId = '';
    this.headerModel.VehicleNo = '';

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  back() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.read();
  }

  chooseTransportShipTo() {

    // if (this.criteriaModel.TransportTypeId != 'XD') {
    //   this.toastr.warning('ระบุ Type of Work เป็น X Dock ก่อน', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //   return
    // }
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานที่',IsHub :'Y' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.HubId = result.Id;
        this.headerModel.HubCode = result.Code;
        this.headerModel.HubDescription = result.Code + ' - ' + result.CustomerName;
      }
    });
  }
  chooseTransport() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Transport', listData: this.listTransport, listDataSearch: this.listTransport } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.TransportId = result.Id;
        this.headerModel.TransportCode = result.Code;
        this.headerModel.TransportDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }
  save() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "Code": this.headerModel.Code,
      "FirstName": this.headerModel.FirstName,
      "LastName": this.headerModel.LastName,
      "UserName": this.headerModel.UserName,
      "Password": this.headerModel.Password,
      "GroupCode": this.headerModel.GroupCode,
      "NationalityID": this.headerModel.NationalityID,
      "VehicleId": this.headerModel.VehicleId,
      "LicenseNo": this.headerModel.LicenseNo,
      "Mobile": this.headerModel.Mobile,
      "Email": this.headerModel.Email,
      "Sex": this.headerModel.Sex,
      "Active": this.headerModel.Active,
      "HubId": this.headerModel.HubId,
      "TransportId": this.headerModel.TransportId,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/SaveUser', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.back();
      }
      else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  delete(param) {

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: false, height: '150px', width: '300px', data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?'} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
         this.spinner.show();

        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "Id": param.Id ,
        }

        let json = JSON.stringify(criteria);

        this.serviceProviderService.post('api/Masters/DeleteUser', criteria).subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.spinner.hide();
            this.toastr.success('เสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            // debugger
            this.back();
          }
          else {
            this.spinner.hide();
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });

      this.read();
      }
    });
  }
}
