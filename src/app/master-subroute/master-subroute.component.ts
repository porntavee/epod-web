import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, GroupUserDialog, RoutingDialog, VehicleDialog } from '../dialog/dialog';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  selector: 'app-master-subroute',
  templateUrl: './master-subroute.component.html',
  styleUrls: ['./master-subroute.component.css']
})
export class MasterSubrouteComponent implements OnInit, AfterContentChecked {

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

  listGroupUser: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.read();

  }

  viewModel: any;
  read() {
    this.spinner.show();

    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "RouteId": this.criteriaModel.RouteId,
      "Fillter": this.criteriaModel.Fillter,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetSubRoute', criteria).subscribe(data => {
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

      debugger

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  /*--------------------------Start Define Method Ohm -------------------------------*/
  // Set Header Model By Ohm.
  setHeaderModel(model) {
    // Setting header model.
    for (const key in model) {
      this.headerModel[key] = model[key];
    } 
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  /*-------------------------------------- End Ohm ----------------------------------*/

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
  }

  clear() {
    this.criteriaModel = {};
  }

  add() {
    this.spinner.show();
    this.headerModel.Operation = 'INSERT';
    this.headerModel.Id = 'Auto';
    this.headerModel.RouteId = '';
    this.headerModel.Code = '';
    this.headerModel.Description = '';
    this.headerModel.Active = 'Y';


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

    if(this.headerModel.RouteId == '' || this.headerModel.RouteId == undefined){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Operation": this.headerModel.Operation,
      "RouteId": this.headerModel.RouteId,
      "Id": this.headerModel.Id,
      "Code": this.headerModel.Code,
      "Description": this.headerModel.Description,
      "Active": this.headerModel.Active,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/SaveSubRoute', criteria).subscribe(data => {
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

         this.headerModel.Operation = 'DELETE';
        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }

        let json = JSON.stringify(criteria);

        this.serviceProviderService.post('api/Masters/SaveSubRoute', criteria).subscribe(data => {
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

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เส้นทางหลัก' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Description;

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

      if (result != undefined) {
        this.headerModel.RouteId = result.Id;
        this.headerModel.RouteCode = result.Code;
        this.headerModel.RouteDescription = result.Description;

      }
      else {
        this.headerModel.RouteId = '';
        this.headerModel.RouteCode = '';
        this.headerModel.RouteDescription = '';
      }
    });
  }

}