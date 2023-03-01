import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TransportNoDialog, ShipToDialog, StatusDialog, TypeOfWorkDialog, RouteDialog, VehicleDialog, DriverDialog, ConfirmDialog, MasterDataDialog, LocationAddressDataDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  isMainPage: boolean = true;
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

  id: any = '';

  constructor(public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService) {

    this.route.queryParams.subscribe(params => {
      let model: any = this.route.snapshot.params;
      this.id = model.id;
    });
  }

  ngOnInit(): void {

    // this.listEmployeeCode = [{ value: '', display: '----- เลือก -----' },
    // { value: 'TH00641001026', display: 'TH00641001026' },
    // { value: 'TH00641001027', display: 'TH00641001027' },
    // { value: 'TH00641001028', display: 'TH00641001028' }];
    // this.listFirstName = [{ value: '', display: '----- เลือก -----' },
    // { value: '1', display: 'First Name' },
    // { value: '2', display: 'First Name' },
    // { value: '3', display: 'First Name' }];

    // this.criteriaModel.statusCode = 'O';
    // this.criteriaModel.statusDescription = 'O - รอยืนยันใบคุมรถ';
    const date = new Date();

    this.criteriaModel.OrderDate = moment(date).format('YYYYMMDD');
    this.criteriaModel.InvoiceDate = moment(date).format('YYYYMMDD');
    this.criteriaModel.OrderEstimate = moment(date.setDate(date.getDate() + 1)).format('YYYYMMDD');
    // this.read();
    // this.readRoute();

    this.criteriaModel.UoM = 'N/A';

    if (this.id != 'new') {
      this.read();
    }
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "OrderNo": this.id,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetOrder', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        this.criteriaModel = model.Data[0];

        this.criteriaModel.OrderTypeId = model.Data[0].OrderTypeId;
        this.criteriaModel.OrderTypeDescription =  model.Data[0].OrderTypeCode + ' - ' + model.Data[0].OrderType;


        this.criteriaModel.OwnerId = model.Data[0].OwnerId;
        this.criteriaModel.OwnerDescription = model.Data[0].OwnerCode + ' - ' + model.Data[0].OwnerName;


        this.criteriaModel.ShiptoId = model.Data[0].ShiptoId;
        this.criteriaModel.ShiptoCode = model.Data[0].ShiptoCode;
        this.criteriaModel.ShiptoAddress = model.Data[0].Address;
        this.criteriaModel.InvoiceDate = model.Data[0].InvoiceDate;
        this.criteriaModel.ShiptoDescription = model.Data[0].ShiptoCode + ' - ' + model.Data[0].ShiptoName;;
        this.criteriaModel.ShiptoMobile = model.Data[0].Mobile;


        this.criteriaModel.routeId = model.Data[0].RouteId;
        this.criteriaModel.subRouteId = model.Data[0].SubRouteId;
        this.criteriaModel.RouteDescription =  model.Data[0].Route;
        this.criteriaModel.SubRouteDescription = model.Data[0].SubRoute;

        console.log(this.criteriaModel);


        // this.criteriaModel.OwnerDescription = model.Data[0].OwnerName;
        // this.criteriaModel.ShiptoDescription = model.Data[0].ShiptoName;
        // this.criteriaModel.ShiptoDescription = model.Data[0].ShiptoName;
        // this.criteriaModel.ShiptoMobile = model.Data[0].ShiptoMobile;
        // this.criteriaModel.ShiptoAddress = model.Data[0].ShiptoAdress;
        // this.criteriaModel.RouteDescription = '';
        // this.criteriaModel.SubRouteDescription = '';

        // model.Data.forEach(element => {
        //   // element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
        //   // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
        //   // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        // });


      }
      else {
        this.criteriaModel = {};
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
          element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
          // element.DriverFirstName = element.DriverFirstName + ' ' + element.DriverLastName;
          // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        });

        this.listDetailModel = model.Data;

        this.isMainPage = false;
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
        this.criteriaModel.ShiptoId = result.Id;
        this.criteriaModel.ShiptoCode = result.Code;
        this.criteriaModel.ShiptoAddress = result.Address;
        this.criteriaModel.ShiptoDescription = result.Code + ' - ' + result.CustomerName;
        this.criteriaModel.ShiptoMobile = result.Mobile;
        this.criteriaModel.RouteDescription = result.Route;
        this.criteriaModel.SubRouteDescription = result.SubRoute;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  //use
  chooseOwner() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(LocationAddressDataDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เจ้าของงาน' ,  urlapi:'api/Masters/GetOwner'} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.OwnerId = result.Id;
        this.criteriaModel.OwnerDescription = result.Code + ' - ' + result.Description;
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

  chooseJobType() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(MasterDataDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ประเภทเอกสาร' , urlapi:'api/Masters/GetJobType' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.OrderTypeId = result.Code;
        this.criteriaModel.OrderTypeDescription = result.Code + ' - ' + result.Description;
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
        this.criteriaModel.OrderTypeId = result.Code;
        this.criteriaModel.OrderTypeDescription = result.Code + ' - ' + result.Description;
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
    this.criteriaModel = { apptDate: '' };
  }

  formatDate(date) {
    return (date != undefined && date != "Invalid date") ? moment(date).format('YYYY-MM-DD 00:00:00.000') : undefined
  }

  create() {

    this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
    this.criteriaModel.OrderDate = moment(this.criteriaModel.OrderDate).format('YYYY-MM-DDT00:00:00');
    this.criteriaModel.OrderEstimate = moment(this.criteriaModel.OrderEstimate).format('YYYY-MM-DDT00:00:00');
    this.criteriaModel.InvoiceDate =this.formatDate(this.criteriaModel.InvoiceDate);
    this.criteriaModel.UoM = this.criteriaModel.UoM;
    this.criteriaModel.Process = "CREATE";

    let json = JSON.stringify(this.criteriaModel);

    // debugger;

    console.log(json);

    this.serviceProviderService.post('api/Transport/CreateOrder', this.criteriaModel).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.criteriaModel.OrderNo = model.Data;
        this.toastr.success("บันทึกข้อมูลเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.id = this.criteriaModel.OrderNo;
        this.ngOnInit();
        // window.self.close(); 
        // this.listModel = model.Data;
      }
      else {
        // this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  update() {

    this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
    this.criteriaModel.OrderDate = moment(this.criteriaModel.OrderDate).format('YYYY-MM-DDT00:00:00');
    this.criteriaModel.OrderEstimate = moment(this.criteriaModel.OrderEstimate).format('YYYY-MM-DDT00:00:00');
    this.criteriaModel.InvoiceDate =this.formatDate(this.criteriaModel.InvoiceDate);
    this.criteriaModel.UoM = this.criteriaModel.UoM;
    this.criteriaModel.Process = "UPDATE";

    let json = JSON.stringify(this.criteriaModel);

    // debugger;

    this.serviceProviderService.post('api/Transport/CreateOrder', this.criteriaModel).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      // debugger

      if (model.Status) {
        // this.criteriaModel.OrderNo = model.Data;
        this.toastr.success("บันทึกข้อมูลเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.id = this.criteriaModel.OrderNo;
        this.ngOnInit();
        // this.listModel = model.Data;
      }
      else {
        // this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }


  close(){
    window.self.close();
  }
}
