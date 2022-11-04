import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceProviderService } from './../shared/service-provider.service';
import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffer, KeyValueDiffers, KeyValueChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  criteriaModel: any = {} //ค้นหา
  title: string = 'เพิ่มข้อมูล';
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  p = 1;


  listEmployeeCode: any = [];
  listFirstName: any = [];
  listActive: any = [];
  listPosition: any = [];
  listBranch: any = [];

  oldPassword: any = '';
  typePassword: any = 'password';

  constructor(public dialog: MatDialog, private serviceProviderService: ServiceProviderService, private spinner: NgxSpinnerService, private toastr: ToastrService, private differs: KeyValueDiffers) { }

  ngOnInit(): void {

    this.listEmployeeCode = [{ value: '', display: '----- Select -----' },
    { value: 'TH00641001026', display: 'TH00641001026' },
    { value: 'TH00641001027', display: 'TH00641001027' },
    { value: 'TH00641001028', display: 'TH00641001028' }];
    this.listFirstName = [{ value: '', display: '----- Select -----' },
    { value: '1', display: 'First Name' },
    { value: '2', display: 'First Name' },
    { value: '3', display: 'First Name' }];
    this.listActive = [{ value: '', display: '----- Select -----' },
    { value: 'Y', display: 'Y' },
    { value: 'N', display: 'N' }];

    this.read();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "empID": this.criteriaModel.empID,
      "Code": this.criteriaModel.Code,
      "Active": this.criteriaModel.Active,
      "FirstName": this.criteriaModel.FirstName,
      "Position": this.criteriaModel.Position,
      "Branch": this.criteriaModel.Branch,
      // "DateFrom": this.criteriaModel.DateFrom
    }

    let json = JSON.stringify(criteria);
    debugger


    this.serviceProviderService.post('api/B1/Employees', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;


      if (model.Status) {
        this.listModel = model.Data;
      }
      else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });


    this.serviceProviderService.post('api/B1/GetPosition', criteria).subscribe(data => {
      // this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;


      if (model.Status) {
        this.listPosition = model.Data;
        this.listPosition.forEach(element => {
          element.value = element.name;
          element.display = element.name;
        });
      }
      else {
        // this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      // this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.serviceProviderService.post('api/B1/GetBranch', criteria).subscribe(data => {
      // this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;


      if (model.Status) {
        this.listBranch = model.Data;
        this.listBranch.forEach(element => {
          element.value = element.Name;
          element.display = element.Name;
        });
      }
      else {
        // this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      // this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  edit(param) {

    if (param.empID != undefined) {
      this.title = 'แก้ไขข้อมูล';
      this.model = param;
      this.oldPassword = this.model.PassWord;

      let criteria = {
        "userinformation": this.serviceProviderService.userinformation,
        "empID": this.model.empID,
        // "FirstName": this.criteriaModel.FirstName,
        // "DateFrom": this.criteriaModel.DateFrom
      }
      this.serviceProviderService.post('api/TimeSheet/GetTimeSheet', criteria).subscribe(data => {
        // this.spinner.hide();
        let model: any = {};
        model = data;
        // this.viewModel = model;


        if (model.Status) {
          this.models = model.Data;
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

    this.isMainPage = false;
    this.isFormPage = true;
    this.isTimeSheetPage = false;
  }

  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
  }

  goToTimeSheet() {
    this.isMainPage = false;
    this.isFormPage = false;
    this.isTimeSheetPage = true;
  }

  backToForm() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.isTimeSheetPage = false;
  }

  addTimeSheet() {

    this.timeSheetModel.DateFrom = moment(this.timeSheetModel.DateFrom).format('DD-MM-YYYY');
    this.timeSheetModel.DateTo = moment(this.timeSheetModel.DateTo).format('DD-MM-YYYY');
    this.timeSheetModel.Date = moment(this.timeSheetModel.Date).format('DD-MM-YYYY');
    this.timeSheetModel.isNew = true;

    const newTimeSheet = JSON.parse(JSON.stringify(this.timeSheetModel));
    this.models.push(newTimeSheet);
    this.timeSheetModel = {};
    this.backToForm();
  }

  create() {
    this.spinner.show();

    // let TimeSheetDetail = this.models.filter(c => c.isNew);
    // this.models.forEach(element => {

    // });

    if (this.model.PassWord != this.oldPassword)
    {
      this.changePassword();
    }


    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "empID": this.model.empID,
      "Auth_User": this.model.Auth_User,
      "Auth_TimeSheet": this.model.Auth_TimeSheet,
      "Auth_DocLogReport": this.model.Auth_DocLogReport,
      "Auth_UserLogReport": this.model.Auth_UserLogReport
    }

    this.serviceProviderService.post('api/B1/UpdateEmployeeAuth', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;


      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('Update Success.', 'แจ้งเตือนระบบ', { timeOut: 5000 });
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

  showPassword() {
    if (this.typePassword == 'password')
      this.typePassword = 'text';
    else if (this.typePassword == 'text') {
      this.typePassword = 'password';
    }
  }

  changePassword() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "empID": this.model.empID,
      "Password": this.model.PassWord
      // "FirstName": this.criteriaModel.FirstName,
      // "DateFrom": this.criteriaModel.DateFrom
    }

    this.serviceProviderService.post('api/B1/ResetEmployeePassWord', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {
        // this.backToLogin();
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

}
