import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TransportNoDialog, ShipToDialog, JobStatusDialog, TypeOfWorkDialog, RouteDialog, VehicleDialog, DriverDialog, ConfirmDialog, UploadOrderDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

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

  listRoute: any = [];

  constructor(public dialog: MatDialog,
    private router: Router,
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

    this.criteriaModel.statusCode = 'O';
    this.criteriaModel.statusDescription = 'O - รอจัดใบคุมรถ';

    this.read();
    this.readRoute();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "OrderNo": this.criteriaModel.orderNo,
      "InvoiceNo": this.criteriaModel.invoiceNo,
      "ShiptoId": this.criteriaModel.shipToId,
      "OrderDateStart": this.criteriaModel.orderDate != undefined && this.criteriaModel.orderDate != "Invalid date" ? moment(this.criteriaModel.orderDate).format('YYYY-MM-DD 00:00:00.000') : undefined,
      "OrderDateEnd": this.criteriaModel.orderDateEnd != undefined && this.criteriaModel.orderDateEnd != "Invalid date" ? moment(this.criteriaModel.orderDateEnd).format('YYYY-MM-DD 00:00:00.000') : undefined,
      "OrderStatus": this.criteriaModel.statusCode,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetOrder', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {
          element.OrderEstimate = moment(element.OrderEstimate).format('DD-MM-YYYY');
          element.OrderDate = moment(element.OrderDate).format('DD-MM-YYYY');
          // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
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

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
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

        model.Data.forEach(element => {
          element.OrderEstimateStr = moment(element.OrderEstimate).format('DD-MM-YYYY');
          // element.DriverFirstName = element.DriverFirstName + ' ' + element.DriverLastName;
          // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        });

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

    for (let index = 0; index < this.listDetailModel.length; index++) {
      this.listDetailModel[index].Seq = index + 1;
    }
    // this.listDetailModel.forEach(element => {
    //   element.Seq = 
    // });

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
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
        this.spinner.hide();
        this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });

        this.backToMain();
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

  cancel() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "TransportNo": this.headerModel.TransportNo,
      // "TTRANSPORTDS": this.listDetailModel
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/CancelTransport', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.backToMain();
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
  chooseTransportNo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TransportNoDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Transport No.' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.transportNo = result.TransportNo;
        // this.criteriaModel.shipToCode = result.Code;
        // this.criteriaModel.shipToAddress = result.Address;
        // this.criteriaModel.shipToDescription = result.Code + ' - ' + result.CustomerName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
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
    const dialogRef = this.dialog.open(JobStatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานะ' } });

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

  //use
  chooseRoute() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Route', listData: this.listRoute, listDataSearch: this.listRoute } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {

        this.criteriaModel.subRouteId = '';
        this.criteriaModel.subRouteCode = '';
        this.criteriaModel.subRouteDescription = '';

        this.criteriaModel.routeId = result.Id;
        this.criteriaModel.routeCode = result.Code;
        this.criteriaModel.routeDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseVehicle() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Vehicle' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.vehicleId = result.Id;
        this.criteriaModel.vehicleCode = result.Code;
        this.criteriaModel.vehicleDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Driver' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.driverId = result.Id;
        this.criteriaModel.driverCode = result.Code;
        this.criteriaModel.driverDescription = result.Code + ' - ' + result.FirstName + ' ' + result.LastName;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  readRoute() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetRoute', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listRoute = model.Data;
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
      "userinformation": this.serviceProviderService.userinformation,
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

  clear() {
    this.criteriaModel = { orderDate: '' };
  }

  delete(param) {

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: false, height: '150px', width: '300px', data: { title: 'คุณต้องลบรายการใช่หรือไม่?' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {

        let criteria: any = {};
        criteria.userinformation = this.serviceProviderService.userinformation;
        criteria.Process = 'DELETE';
        criteria.OrderNo = param;
        // this.criteriaModel.TransportStatus = "O";
        // this.criteriaModel.TransportTypeId = "OT";
        // this.criteriaModel.RegionId = "0010000000000";
        // this.criteriaModel.CreateBy = "0010000000000";
        // this.criteriaModel.OrderEstimate = moment(this.criteriaModel.OrderEstimate).format('YYYY-MM-DDT00:00:00');
        // this.criteriaModel.UoM = "N/A";

        // let json = JSON.stringify(this.criteriaModel);


        this.serviceProviderService.post('api/Transport/CreateOrder', criteria).subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;


          if (model.Status) {
            this.criteriaModel.TransportNo = model.Data;
            this.toastr.success("ลบรายการเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.read();
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });

  }

  statusOrderColor(param) {
    switch (param) {
      case 'C':
        return '#E16E5B'
      case 'D':
        return '#F7E884'
      case 'L':
        return '#F7E884'
      case 'O':
        return '#B6B6B6'
      case 'P':
        return '#79D58B'
      case 'R':
        return '#79D58B'
      case 'S':
        return '#66A5D9'
      case 'W':
        return '#B6B6B6'
      case 'F':
        return '#EBB146'
      case 'H':
        return '#66A5D9'
      default:
        break;
    }

  }

  create() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`order-form/new`])
      // this.router.createUrlTree([`order-form/new`])
    );

    window.open(url, '_blank');
  }

  edit(param) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`order-form/` + param])
      // this.router.createUrlTree([`order-form/` + param])
    );

    window.open(url, '_blank');
  }

  upload() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(UploadOrderDialog, { disableClose: false, height: '600px', width: '1000px', data: { title: 'คุณต้องลบรายการใช่หรือไม่?' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (!result) {
        return;
      }
      else {



        // this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
        // this.criteriaModel.OrderDate = moment(this.criteriaModel.OrderDate).format('YYYY-MM-DDT00:00:00');
        // this.criteriaModel.OrderEstimate = moment(this.criteriaModel.OrderEstimate).format('YYYY-MM-DDT00:00:00');
        // this.criteriaModel.UoM = this.criteriaModel.UoM;
        // this.criteriaModel.Process = "CREATE";

        debugger
        const [day, month, year] = result[0].IssueDate.split('/');
        const date = new Date(+year, +month - 1, +day);
        console.log(moment(date).format('YYYY-MM-DDT00:00:00'));
        console.log(moment(date.setDate(date.getDate() + 1)).format('YYYY-MM-DDT00:00:00'));

        // this.criteriaModel = {
        //   "OrderDate": moment(result.IssueDate).format('YYYY-MM-DDT00:00:00'),
        //   "OrderEstimate": moment(this.criteriaModel.IssueDate.setDate(this.criteriaModel.IssueDate.getDate() + 1)).format('YYYY-MM-DDT00:00:00'),
        //   "InvoiceNo": "1",
        //   "Comment": "1",
        //   "ReferenceNo": "1",
        //   "OrderTypeDescription": "NM - Normal",
        //   "PurchaseNo": "1",
        //   "CBM": "1",
        //   "OwnerDescription": "81430 - บริษัท ปตท.บริหารธุรกิจค้าปลีก จำกัด(ปทุมธานี-ลาดหลุมแก้ว กม.26)",
        //   "Qty": "1",
        //   "ShiptoDescription": "81971 - หจก.พัชรัตน์เกียรติ",
        //   "Weight": "1",
        //   "ShiptoAddress": "154/89 ม.7 ถ.ศรีพรหมโสภิต ต.บางมัญ อ.เมืองสิงห์บุรี จ.สิงห์บุรี 16000 โทร.093-94",
        //   "RouteDescription": "0010000000067",
        //   "SubRouteDescription": "0010000001374",
        //   "OrderTypeId": "NM",
        //   "OwnerId": "0010000000033",
        //   "ShiptoId": "0010000000233",
        //   "ShiptoCode": "81971",
        //   "ShiptoMobile": "",
        //   "userinformation": {
        //     "UserId": "0010000000000",
        //     "UserName": "demow",
        //     "GroupCode": "S",
        //     "dbName": "WTX-EPOD",
        //     "Version": "22.11.01.01"
        //   },
        //   "Version": "20221102"
        // }


        // let json = JSON.stringify(this.criteriaModel);

        // // debugger;

        // this.serviceProviderService.post('api/Transport/CreateOrder', this.criteriaModel).subscribe(data => {
        //   this.spinner.hide();
        //   let model: any = {};
        //   model = data;
        //   this.viewModel = model;

        //   if (model.Status) {
        //     this.criteriaModel.OrderNo = model.Data;
        //     this.toastr.success("บันทึกข้อมูลเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
        //     this.id = this.criteriaModel.OrderNo;
        //     this.ngOnInit();
        //     // window.self.close(); 
        //     // this.listModel = model.Data;
        //   }
        //   else {
        //     // this.listModel = [];
        //     this.spinner.hide();
        //     this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        //   }

        // }, err => {
        //   this.spinner.hide();
        //   this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        // });
      }
    });
  }


}
