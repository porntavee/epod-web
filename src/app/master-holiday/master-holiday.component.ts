import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  templateUrl: './master-holiday.component.html',
  styleUrls: ['./master-holiday.component.css']
})
export class MasterHolidayComponent  implements OnInit, AfterContentChecked {

  isDebugMode     : boolean = true;
  isMainPage      : boolean = true;
  isFormPage      : boolean = false;
  isTimeSheetPage : boolean = false;
  headerModel     : any     = {};
  criteriaModel   : any     = {}; //ค้นหา
  criteria        : any     = {}; // User Information.
  model           : any     = {}; //ข้อมูล Form
  listModel       : any     = []; //ข้อมูลในตารางหน้า Main
  listVehicleType : any     = [];
  currentPage     : number  = 1;

  constructor(
    public dialog                  : MatDialog,
    private spinner                : NgxSpinnerService,
    private toastr                 : ToastrService,
    private changeDetector         : ChangeDetectorRef,
    private serviceProviderService : ServiceProviderService
  ) { 
    // Initialize userinformation to criteria object.
    this.criteria = { 
      "userinformation": this.serviceProviderService.userinformation
    }; 
  }

  ngOnInit(): void {
    this.renderHolidayTable();
    this.renderHolidayCheck();
  }

  renderHolidayTable(): void {
    // Show spinner.
    this.spinner.show();
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    // Request Data From API.
    this.serviceProviderService.post('api/Masters/GetHolidayDate', this.criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      if (model.Status) {
        model.Data.forEach(element => {
          element.StrDate = moment(element.Date).format('DD-MM-YYYY');
        });
        this.listModel = model.Data;
      } else {
        this.listModel = this.loadDataFalse(model.Message);
      }
    }, err => {
        this.spinner.hide();
      this.hideSninnerAndShowError(err.message);
    });
  }

  renderHolidayCheck() {
    // Show spinner.
    this.spinner.show();
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    // Request Data From API.
    this.serviceProviderService.post('api/Masters/GetHoliday', this.criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      this.headerModel = model.Status ? model.Data[0] : this.loadDataFalse(model.Message);
      Logger.info('master-holiday', 'renderHolidayCheck:', this.headerModel, this.isDebugMode)
    }, err => {
      this.hideSninnerAndShowError(err.message);
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
    this.hideSninnerAndShowError(message);

    return _listModel;
  }

  // If sucess load data.
  private hideSninnerAndShowSuccess(message: string) {
    this.spinner.hide();
    this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // If error load data.
  private hideSninnerAndShowError(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // Set go to form page.
  private goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  setForm(param) {
    this.spinner.show();

    let _criteria = {
      "Id": param.Id,
      "StrDate": moment(param.Date).format('YYYYMMDD')
    }
    _criteria = {...this.criteria, ..._criteria};


    let _headerModel = {
      Operation: 'UPDATE'
    }
    _headerModel = {..._criteria, ..._headerModel};

    // Setting header model.
    this.headerModel = this.setModel(_headerModel);

    // Set to from page.
    this.goToFromPage();
  }

  clear() {
    this.criteriaModel = {"Date": ''};
  }

  addForm() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id : 'Auto',
      Date : '',
      Description : '',
    }
    // Setting header model.
    this.headerModel = this.setModel(_headerModel);
    Logger.info('master-holiday', 'addForm.this.headerModel', this.headerModel, this.isDebugMode)
    // Set to from page.
    this.goToFromPage();
  }

  back() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.renderHolidayTable();
    this.renderHolidayCheck();
  }

  save() {
    this.spinner.show();

    Logger.info('master-holiday', 'save-this.headerModel', this.headerModel, this.isDebugMode)
    let criteria = {
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "Date": moment(this.headerModel.StrDate).format('YYYY-MM-DDT00:00:00'),
      "Description": this.headerModel.Description,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-holiday', 'save', criteria, this.isDebugMode)

    this.serviceProviderService.post('api/Masters/SaveHoliday', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.back();
      } else {
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
      Logger.info('master-holiday', 'delete', result, this.isDebugMode)

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
      // Clear criteriaModel
      this.clear();
      // Reload Table data.
      this.renderHolidayTable();
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}