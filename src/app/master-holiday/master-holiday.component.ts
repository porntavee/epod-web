import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, GroupUserDialog, VehicleDialog } from '../dialog/dialog';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  templateUrl: './master-holiday.component.html',
  styleUrls: ['./master-holiday.component.css']
})
export class MasterHolidayComponent  implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [];
  headerModel: any = {};
  criteriaModel: any = {} //ค้นหา
  criteria: object = { 
    "userinformation": this.serviceProviderService.userinformation
  }; // User Information.
  title: string = 'เพิ่มข้อมูล';
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  dateControl = new FormControl(moment().format('YYYYMMDD'));

  mode: any = 'create';

  currentPage = 1;

  listGroupUser: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.read();
    this.read2();

  }

  // viewModel: any;
  read() {
    this.spinner.show();

    this.headerModel.Operation = 'SELECT';

    this.serviceProviderService.post('api/Masters/GetHolidayDate', this.criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;

      if (model.Status) {
        model.Data.forEach(element => {
          element.StrDate = moment(element.Date).format('DD-MM-YYYY');
        });


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

  read2() {
    this.spinner.show();

    this.headerModel.Operation = 'SELECT';
    this.serviceProviderService.post('api/Masters/GetHoliday', this.criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
 
      if (model.Status) {
        this.headerModel = model.Data[0];
      }
      else {
        this.headerModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  // Set Header Model.
  setHeaderModel(model) {
    // Setting header model.
    for (const key in model) {
      this.headerModel[key] = model[key];
    } 
  }

  readDetail(param) {
    this.spinner.show();

    this.headerModel = {};
    this.headerModel = param;

    let _headerModel = {
      Operation: 'UPDATE',
      StrDate: moment(param.Date).format('YYYYMMDD')
    }
    // Setting header model.
    this.setHeaderModel(_headerModel);

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  clear() {
    this.criteriaModel = {"Date": ''};
  }

  add() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id : 'Auto',
      Date : '',
      Description : '',
    }
   // Setting header model.
   this.setHeaderModel(_headerModel);

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  back() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.read();
    this.read2();
  }

  save() {
    this.spinner.show();

    let criteria = {
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "Date": moment(this.headerModel.StrDate).format('YYYY-MM-DDT00:00:00'),
      "Description": this.headerModel.Description,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveHoliday', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
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

  update() {
    this.spinner.show();

    let criteria = {
      "Monday": this.headerModel.Monday,
      "Tuesday": this.headerModel.Tuesday,
      "Wednesday": this.headerModel.Wednesday,
      "Thursday": this.headerModel.Thursday,
      "Friday": this.headerModel.Friday,
      "Saturday": this.headerModel.Saturday,
      "Sunday": this.headerModel.Sunday
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/UpdateHoliday', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
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
    const dialogRef = this.dialog.open(ConfirmDialog,{
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
         this.spinner.show();

         this.headerModel.Operation = 'DELETE';
        let criteria = {
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveHoliday', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = data;

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