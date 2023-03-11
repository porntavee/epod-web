import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, GroupUserDialog, RoutingDialog, VehicleDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  templateUrl: './master-subroute.component.html',
  styleUrls: ['./master-subroute.component.css']
})
export class MasterSubrouteComponent implements OnInit, AfterContentChecked {
  
  isDebugMode: boolean = true;
  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [];
  headerModel: any = {};
  criteriaModel: any = {} //ค้นหา
  criteria: object = { 
    "userinformation": this.serviceProviderService.userinformation
  }; // User information
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
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.read();
  }

  viewModel: any;
  read() {
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "RouteId": this.criteriaModel.RouteId,
      "Fillter": this.criteriaModel.Fillter,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-subroute', 'read', criteria, this.isDebugMode)

    this.serviceProviderService.post('api/Masters/GetSubRoute', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      this.viewModel = model;
      if (model.Status) {
        this.listModel = model.Data;
      } else {
        this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  /*--------------------------Start Define Method Ohm -------------------------------*/
  // Set Header Model.
  setHeaderModel(model) {
    // Setting header model.
    for (const key in model) {
      this.headerModel[key] = model[key];
    } 
  }

  // Set Header Model.
  setCriteriaModel(model) {
    // Setting header model.
    for (const key in model) {
      this.criteriaModel[key] = model[key];
    } 
  }

  // Reset Criteria Model.
  resetCriteriaModel(model) {
    for (const key in model) {
      this.criteriaModel[key] = '';
    } 
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  
  // Set to Form Page.
  setToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  // Set to Form Page.
  setToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.spinner.hide();
  }
  /*-------------------------------------- End Ohm ----------------------------------*/

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "Id": param.Id
    }
    criteria = {...this.criteria, ...criteria};

    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';

    // Set to from page.
    this.setToFromPage();
  }

  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    Logger.info('master-vehicle', 'clearAndReloadData', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.read();
  }

  add() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id: 'Auto',
      RouteId: '',
      Code: '',
      Description : '',
      Active: 'Y'
    }
    // Setting header model.
    this.setHeaderModel(_headerModel);
    // Set to from page.
    this.setToFromPage();
  }

  back() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.read();
  }

  save() {

    if(this.headerModel.RouteId == '' || this.headerModel.RouteId == undefined) {
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

    this.serviceProviderService.post('api/Masters/SaveSubRoute', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
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
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?'} 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-subroute', 'delete', result, this.isDebugMode)

      if (result) {
         this.spinner.show();

        this.headerModel.Operation = 'DELETE';
        let criteria = {
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveSubRoute', criteria)
        .subscribe(data => {
          this.spinner.hide();

          let model: any = data;
          this.viewModel = model;
          if (model.Status) {
            this.spinner.hide();
            this.toastr.success('เสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            // debugger
            this.back();
          } else {
            this.spinner.hide();
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
        // Clear criteriaModel and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' }
    });
    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-subroute', 'chooseRoute', result, this.isDebugMode)

      if (result != undefined) {
        let criterai = {
          RouteId: result.Id,
          RouteCode: result.Code,
          RouteDescription: result.Description
        }
        // Set Criteria Model.
        this.setCriteriaModel(criterai);
      } else {
        let criterai = {
          RouteId: '',
          RouteCode: '',
          RouteDescription: ''
        }
        // Reset Criteria Model.
        this.resetCriteriaModel(criterai);
      }
    });
  }
  chooseRoute2() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-subroute', 'chooseRoute2', result, this.isDebugMode)

      if (result != undefined) {
        let criterai = {
          RouteId: result.Id,
          RouteCode: result.Code,
          RouteDescription: result.Description
        }
        // Set Criteria Model.
        this.setCriteriaModel(criterai);
      } else {
        let criterai = {
          RouteId: '',
          RouteCode: '',
          RouteDescription: ''
        }
        // Reset Criteria Model.
        this.resetCriteriaModel(criterai);
      }
    });
  }
}