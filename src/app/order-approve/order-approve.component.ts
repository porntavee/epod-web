import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';
import { ShipToDialog, StatusDialog, TypeOfWorkDialog } from '../dialog/dialog';

@Component({
  selector: 'app-order-approve',
  templateUrl: './order-approve.component.html',
  styleUrls: ['./order-approve.component.css']
})
export class OrderApproveComponent implements OnInit {

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
  listEmployee: any = [];
  listEmployeeCode: any = [];
  listFirstName: any = [];
  listActivityType: any = [];
  listFinancialProject: any = [];
  listStage: any = [];
  costCenter: any = '';
  p = 1;

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService) { }

  ngOnInit(): void {

    // this.listEmployeeCode = [{ value: '', display: '----- เลือก -----' },
    // { value: 'TH00641001026', display: 'TH00641001026' },
    // { value: 'TH00641001027', display: 'TH00641001027' },
    // { value: 'TH00641001028', display: 'TH00641001028' }];
    // this.listFirstName = [{ value: '', display: '----- เลือก -----' },
    // { value: '1', display: 'First Name' },
    // { value: '2', display: 'First Name' },
    // { value: '3', display: 'First Name' }];

    this.read();
    // this.readEmployee();
    // this.readActivityType();
    // this.readFinancialProject();
    // this.readStage();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "D",
        "dbName": "WTX-EPOD",
        "Version": "22.11.01.01"
      },
      "TransportNo": this.criteriaModel.TransportNo,
      "ShiptoId": this.criteriaModel.shipToId,
      "TransportStatus": this.criteriaModel.statusCode,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetTransportHeader', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {
          element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
          // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        });

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
  }

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "D",
        "dbName": "WTX-EPOD",
        "Version": "22.11.01.01"
      },
      "TransportNo": param.TransportNo
    }

    this.headerModel = param;
    this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        // model.Data.forEach(element => {
        //   element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
        //   element.DriverFirstName = element.DriverFirstName + ' ' + element.DriverLastName;
        //   // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
        //   // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        // });

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

  confirm() {
    this.spinner.show();

    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "D",
        "dbName": "WTX-EPOD",
        "Version": "22.11.01.01"
      },
      "TransportNo": this.headerModel.TransportNo,
      "TTRANSPORTDS": this.listDetailModel
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/ApproveTransport', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

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

  setSeq(param, idx) {
    param = idx;
    return param;
  }

  //use
  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Ship to' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.shipToId = result.Id;
        this.criteriaModel.shipToCode = result.Code;
        this.criteriaModel.shipToAddress = result.Address;
        this.criteriaModel.shipToDescription = result.Code + ' - ' + result.CustomerName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(StatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Type of Work' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.statusCode = result.Code;
        this.criteriaModel.statusDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseTypeOfWork() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TypeOfWorkDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Type of Work' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.typeOfWorkCode = result.Code;
        this.criteriaModel.typeOfWorkDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }


  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.read();
    // this.model = {};
    // this.models = [];
    // this.listModel = [];
  }

  reportModel: any = [];
  exportAsXLSX(param): void {

    this.spinner.show();

    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      },
      "DocNum": param.DocNum
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('/api/B1/getTimeSheetLog', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {
        // this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        // this.read();
        this.reportModel = model.Data


        // const dialogRef = this.dialog.open(DocLogDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Doc Log Report', listData: this.reportModel, listDataSearch: this.reportModel } });

        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);

        //   if (result != undefined) {
        //      this.excelService.exportAsExcelFile(result, 'doc-log-report');
        //   }
        // });

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

  exportAsXLSX2(): void {
    this.spinner.show();

    let code = 'AC001';
    let zdocNum = 'AC002';
    let firstName = 'ลลิตา';
    let dateFrom = '01/06/2022';
    let lastName = 'ลลิตา';
    let dateTo = '01/06/2022';


    let excelModel = [];
    excelModel.push(
      { 'Code': 'First Name', [this.model.Code]: this.model.FirstName, ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': 'Date From', [' ' + this.model.DocNum]: moment(this.model.DateFrom).format('DD-MM-YYYY'), '        ': '', '         ': '' },
      { 'Code': 'Last Name', [this.model.Code]: this.model.LastName, ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': 'Date To', [' ' + this.model.DocNum]: moment(this.model.DateTo).format('DD-MM-YYYY'), '        ': '', '         ': '' },
      { 'Code': '', [this.model.Code]: '', ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': '', [' ' + this.model.DocNum]: '', '        ': '', '         ': '' },
      { 'Code': 'Date', [this.model.Code]: 'Start Time', ' ': 'Hour', '  ': 'End Time', '   ': 'Activity Type', '    ': 'Financial Project', '     ': 'Cost Center', '      ': 'Stage', '       ': 'Break', 'Doc Num': 'Nonbillable Time', [' ' + this.model.DocNum]: 'Effective Time', '        ': 'Billable Time', '         ': 'Detail' });


    this.models.forEach(element => {
      excelModel.push(
        { 'Code': element.Date, [this.model.Code]: element.StartTimeText, ' ': element.U_HMC_Hour, '  ': element.EndTimeText, '   ': element.ActType, '    ': element.FiProject, '     ': element.CostCenter, '      ': element.U_HMC_Stage, '       ': element.BreakText, 'Doc Num': element.NonBillTmText, [' ' + this.model.DocNum]: element.EffectTmText, '        ': element.BillableTmText, '         ': element.U_HMC_Detail }
      );
    });
    this.excelService.exportAsExcelFile(excelModel, 'timesheet-report');
    // this.excelService.exportAsExcelFile(this.listModel, 'user-log-report');
    this.spinner.hide();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listDetailModel, event.previousIndex, event.currentIndex);
  }
}
