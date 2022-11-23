import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog ,RoutingDialog, SubRoutingDialog,RegionDialog,ProvinceDialog,DistrictDialog } from '../dialog/dialog';

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


    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();

    // let criteria = {
    //   "userinformation": this.serviceProviderService.userinformation,
    //   "Id": param.Id
    // }
    // let json = JSON.stringify(criteria);
    // this.serviceProviderService.post('api/Masters/GetShipto', criteria).subscribe(data => {
    //   this.spinner.hide();
    //   let model: any = {};
    //   model = data;
    //   this.viewModel = model;

    //   if (model.Status) {

    //     // this.listDetailModel = model.Data;

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



  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เส้นทางหลัก' } });

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


  chooseRoute2() {
    const dialogRef = this.dialog.open(RoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เส้นทางหลัก' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.headerModel.SubRouteId = '';
      this.headerModel.SubRouteCode = '';
      this.headerModel.SubRoute = '';

      if (result != undefined) {
        this.headerModel.RouteId = result.Id;
        this.headerModel.RouteCode = result.Code;
        this.headerModel.Route = result.Description;

      }
      else {
        this.headerModel.RouteId = '';
        this.headerModel.RouteCode = '';
        this.headerModel.Route = '';
      }
    });
  }

  chooseSubRoute2() {

    if(this.headerModel.RouteId == ''){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    
    const dialogRef = this.dialog.open(SubRoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เส้นทางย่อย' ,RouteId : this.headerModel.RouteId} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.SubRouteId = result.Id;
        this.headerModel.SubRouteCode = result.Code;
        this.headerModel.SubRoute = result.Description;
      }
      else {
        this.headerModel.SubRouteId = '';
        this.headerModel.SubRouteCode = '';
        this.headerModel.SubRoute = '';
      }
    });
  }

  chooseRegion2() {
    const dialogRef = this.dialog.open(RegionDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'โซน' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.RegionId = result.Id;
        this.headerModel.RegionCode = result.Code;
        this.headerModel.Region = result.Description;

      }
      else {
        this.headerModel.RegionId = '';
        this.headerModel.RegionCode = '';
        this.headerModel.Region = '';

      }
    });
  }

  chooseProvince2() {
    const dialogRef = this.dialog.open(ProvinceDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'จังหวัด' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.headerModel.DistrictId = '';
      this.headerModel.DistrictCode = '';
      this.headerModel.District = '';

      if (result != undefined) {
        this.headerModel.ProvinceId = result.Id;
        this.headerModel.ProvinceCode = result.Code;
        this.headerModel.Province = result.Description;

      }
      else {
        this.headerModel.ProvinceId = '';
        this.headerModel.ProvinceCode = '';
        this.headerModel.Province = '';

      }
    });
  }

  chooseDistrict2() {

    if(this.headerModel.ProvinceId == ''){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    
    const dialogRef = this.dialog.open(DistrictDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'อำเภอ' ,ProvinceId : this.headerModel.ProvinceId} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.DistrictId = result.Id;
        this.headerModel.DistrictCode = result.Code;
        this.headerModel.District = result.Description;
      }
      else {
        this.headerModel.DistrictId = '';
        this.headerModel.DistrictCode = '';
        this.headerModel.District = '';
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

    this.headerModel.Id = '';
    this.headerModel.CustomerName = '';
    this.headerModel.Address = '';
    this.headerModel.ContractName = '';
    this.headerModel.Mobile = '';
    this.headerModel.District = '';
    this.headerModel.Province = '';
    this.headerModel.PostCode = '';
    this.headerModel.Region = '';
    this.headerModel.Route = '';
    this.headerModel.SubRoute = '';
    this.headerModel.Latitude = '';
    this.headerModel.Longtitude = '';
    this.headerModel.Active = 'Y';

    this.headerModel.DistrictId = '';
    this.headerModel.ProvinceId = '';
    this.headerModel.RegionId = '';
    this.headerModel.RouteId = '';
    this.headerModel.SubRouteId = '';

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
      "CustomerName": this.headerModel.CustomerName,
      "Address": this.headerModel.Address,
      "ContractName": this.headerModel.ContractName,
      "Mobile": this.headerModel.Mobile,
      "District": this.headerModel.District,
      "Province": this.headerModel.Province,
      "PostCode": this.headerModel.PostCode,
      "Region": this.headerModel.Region,
      "Route": this.headerModel.Route,
      "SubRoute": this.headerModel.SubRoute,
      "Latitude": this.headerModel.Latitude,
      "Longtitude": this.headerModel.Longtitude,
      "Active": this.headerModel.Active,
  
      "DistrictId": this.headerModel.DistrictId,
      "ProvinceId": this.headerModel.ProvinceId,
      "RegionId": this.headerModel.RegionId,
      "RouteId": this.headerModel.RouteId,
      "SubRouteId": this.headerModel.SubRouteId,

    }


    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/CreateCustomerLocation', criteria).subscribe(data => {
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

        this.serviceProviderService.post('api/Masters/DeleteCustomerLocation', criteria).subscribe(data => {
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