import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog, VehicleDialog ,RoutingDialog} from '../dialog/dialog';

@Component({
  selector: 'app-master-shiplocation',
  templateUrl: './master-shiplocation.component.html',
  styleUrls: ['./master-shiplocation.component.css']
})
export class MasterShiplocationComponent implements OnInit {

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

  mode: any = 'create';

  p = 1;

  listRoute: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.read();

  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": this.criteriaModel.Code,
      "CustomerName": this.criteriaModel.CustomerName,
      "Address": this.criteriaModel.Address,
      "Mobile": this.criteriaModel.Mobile,
      "ContractName": this.criteriaModel.ContractName,
      "RouteId": this.criteriaModel.RouteId,
      "SubRouteId": this.criteriaModel.SubRouteId,
      "DistrictId": this.criteriaModel.DistrictId,
      "ProvinceId": this.criteriaModel.ProvinceId,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetShipto', criteria).subscribe(data => {
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

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Id": param.Id
    }

    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';
    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        this.listDetailModel = model.Data;

        this.isMainPage = false;
        this.isFormPage = true;
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


  chooseVehicleDetail() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Vehicle' } });

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

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Route' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Code + ' - ' + result.Description;
      }
      else {
        this.criteriaModel.RouteId = '';
        this.criteriaModel.RouteCode = '';
        this.criteriaModel.RouteDescription = '';
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