import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, TransportNoDialog, ShipToDialog, StatusDialog, TypeOfWorkDialog, RouteDialog, VehicleDialog, DriverDialog, JobStatusDialog, JobOrderStatusDialog, TrackingStatusEditDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-tracking-status',
  templateUrl: './tracking-status.component.html',
  styleUrls: ['./tracking-status.component.css']
})
export class TrackingStatusComponent implements OnInit {

  isDebugMode: boolean = true;
  isDelivery: boolean = false;
  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = [
    {
      "Seq": 1,
      "Code": "T",
      "Description": "รอจัดใบคุมรถ",
      "NumStatus": 0
    },
    {
      "Seq": 2,
      "Code": "O",
      "Description": "รอยืนยันใบคุมรถ",
      "NumStatus": 0
    },
    {
      "Seq": 3,
      "Code": "W",
      "Description": "รอคนขับรับงาน",
      "NumStatus": 0
    },
    {
      "Seq": 5,
      "Code": "L",
      "Description": "ระหว่างรับสินค้า",
      "NumStatus": 0
    },
    {
      "Seq": 6,
      "Code": "D",
      "Description": "ระหว่างจัดส่งสินค้า",
      "NumStatus": 0
    },
    {
      "Seq": 7,
      "Code": "P",
      "Description": "จัดส่งสินค้าสำเร็จ",
      "NumStatus": 0
    },
    {
      "Seq": 8,
      "Code": "F",
      "Description": "จัดส่งสินค้าไม่สำเร็จ",
      "NumStatus": 0
    },
    {
      "Seq": 9,
      "Code": "R",
      "Description": "คนขับคืนบิลเสร็จสิ้น",
      "NumStatus": 0
    },
    {
      "Seq": 10,
      "Code": "S",
      "Description": "คืนบิลเสร็จสิ้น",
      "NumStatus": 0
    },
    {
      "Seq": 11,
      "Code": "C",
      "Description": "ยกเลิก",
      "NumStatus": 0
    }
  ]; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [
    // {
    //   CustomerName: "Pick Up order",
    //   TypeOfWork: "Normal",
    //   PlanIn: "25/9/2022",
    //   ActualIn: "25/9/2022",
    //   Status: "Complete"
    // },
    // {
    //   CustomerName: "Customer1",
    //   TypeOfWork: "Service",
    //   PlanIn: "25/9/2022",
    //   ActualIn: "",
    //   Status: "Pending"
    // }
  ];

  listDetailModel2: any = [
    {
      InvoiceNo: "2032022225",
      OrderEstimate: "25/9/2022",
      ActualArrive: "25/9/2022",
      Status: "On time"
    }
  ];

  listDetailModel3: any = [
    {
      DriverReturn: "2032022225",
      DueDate: "25/9/2022",
      ReturnDate: "25/9/2022",
      Status: "On time"
    }
  ];
  listTransport: any = [];
  headerModel: any = {};
  criteriaModel: any = {}; //ค้นหา
  criteriaModelStatus: any = {};
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

  lat = 51.678418;
  lng = 7.809007;

  timelineModel: any = {};



  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    const startDate = new Date();
    const endDate = new Date();
    // this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
    this.criteriaModelStatus.startDate = moment(startDate).format('YYYYMMDD');
    this.criteriaModelStatus.endDate = moment(endDate).format('YYYYMMDD');

    this.readAll();
    this.readRoute();
    this.readTransport();
    // this.readSumStatus();
    // this.read();
  }


  viewModel: any;
  readSumStatus() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "InvoiceDateStart": this.verifyDateTime(this.criteriaModelStatus.startDate),
      "InvoiceDateEnd": this.verifyDateTime(this.criteriaModelStatus.endDate),
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetAllStatus', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        // model.Data.forEach(element => {
        //   element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
        //   // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
        //   // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
        // });

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

  readByStatus(param) {
    this.criteriaModel.OrderStatus = param;
    debugger
    this.read();
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  viewModel2: any = [];
  read(task = '') {
    this.spinner.show();

    this.p = 1;

    let criteria = {
      // Summary Status.
      "InvoiceDateStart": this.verifyDateTime(this.criteriaModelStatus.startDate, 'InvoiceDateStart'),
      "InvoiceDateEnd": this.verifyDateTime(this.criteriaModelStatus.endDate, 'InvoiceDateEnd'),
      // Filter.
      "userinformation": this.serviceProviderService.userinformation,
      "TransportId": this.verifySring(this.criteriaModel.TransportId),
      "TransportNo": this.verifySring(this.criteriaModel.TransportNo),
      "TransportStatus": this.verifySring(this.criteriaModel.transportstatusCode),
      "OrderStatusId": this.verifySring(this.criteriaModel.OrderStatusId),
      "TransportTypeId": this.verifySring(this.criteriaModel.TransportTypeId),
      "OrderEstimate": this.verifyDateTime(this.criteriaModel.OrderEstimate, 'OrderEstimate'),
      "InvoiceNo": this.verifySring(this.criteriaModel.InvoiceNo),
    }
    criteria = { ...this.criteriaModel, ...criteria };

    let json = JSON.stringify(criteria);

    // Check empty search.
    if (task == 'search') {
      let filterNone: any = []
      for (const [key, value] of Object.entries(criteria)) {
        if (key != 'userinformation') {
          filterNone.push(value == undefined || value == '');
        }
      }

      if (!filterNone.includes(false)) {
        this.showErrorMessage('กรุณาระบุเงื่อนไขค้นหา');
        return;
      }
    }

    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;

      if (model.Status) {

        model.Data.forEach(element => {
          element.OrderEstimateStr = moment(element.OrderEstimate).format('DD-MM-YYYY');
          element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
          // element.DriverFirstName = element.DriverFirstName + ' ' + element.DriverLastName;
          // element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          // element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');


          //D P R S 
          // var strDeliveryStatus = "DPRS";
          // if (strDeliveryStatus.includes(String(element.OrderStatus))) {
          //   this.isDelivery = true;
          // }
        });

        debugger

        // 2023-09-06T13:16:47.847
        model.Data.forEach(element => {

          element.DeliveryCheckInTime =
            element.DeliveryCheckInDate != null
              ? element.DeliveryCheckInDate.substr(11, 8)
              : element.DeliveryCheckInDate ?? "";

          element.DeliveryCheckInDate = element.DeliveryCheckInDate != null
            ? element.DeliveryCheckInDate.substr(8, 2) +
            "-" +
            element.DeliveryCheckInDate.substr(5, 2) +
            "-" +
            element.DeliveryCheckInDate.substr(0, 4)
            : element.DeliveryCheckInDate ?? "";

          element.DeliveryCheckOutTime =
            element.DeliveryCheckOutDate != null
              ? element.DeliveryCheckOutDate.substr(11, 8)
              : element.DeliveryCheckOutDate ?? "";

          element.DeliveryCheckOutDate = element.DeliveryCheckOutDate != null
            ? element.DeliveryCheckOutDate.substr(8, 2) +
            "-" +
            element.DeliveryCheckOutDate.substr(5, 2) +
            "-" +
            element.DeliveryCheckOutDate.substr(0, 4)
            : element.DeliveryCheckOutDate ?? "";


          element.AdminReturnDate = element.AdminReturnDate != null
            ? element.AdminReturnDate.substr(8, 2) +
            "-" +
            element.AdminReturnDate.substr(5, 2) +
            "-" +
            element.AdminReturnDate.substr(0, 4)
            : element.AdminReturnDate ?? "";



        });

        this.viewModel2 = model.Data;


      }
      else {
        this.viewModel2 = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  verifySring(str): string {
    return str != undefined ? str : '';
  }

  verifyDateTime(date: string, from: string = ''): any {
    let dateObj: any = date == "Invalid date" || date == undefined ? undefined : moment(date).format('YYYY-MM-DD 00:00:00.000');

    return dateObj;
  }

  readAll() {
    this.readSumStatus();
    this.read();
  }

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "OrderNo": param.OrderNo
    }

    // this.headerModel = param;
    // this.headerModel.DriverFirstName = '';
    // this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);
    this.isDelivery = false;
    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {

        this.headerModel = model.Data[0];

        this.headerModel.OrderEstimateStr = moment(model.Data[0].OrderEstimate).format('DD-MM-YYYY');
        this.headerModel.InvoiceDateStr = moment(model.Data[0].InvoiceDate).format('DD-MM-YYYY');
        this.headerModel.OwnerDescription = model.Data[0].OwnerCode + ' - ' + model.Data[0].OwnerName;
        this.headerModel.ShiptoDescription = model.Data[0].ShiptoCode + ' - ' + model.Data[0].ShiptoName;

        // this.headerModel = model.Data;

        this.isMainPage = false;
        this.isFormPage = true;

        this.readDetailOrder(param);
        this.readTimeline(param);
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

  readDetailOrder(param) {
    // this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "TransportNo": param.TransportNo
    }

    // this.headerModel = param;
    // this.headerModel.DriverFirstName = '';
    // this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);
    this.isDelivery = false;
    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
      // this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {

        this.listDetailModel = model.Data;
        let str = JSON.stringify(this.listDetailModel);

        debugger

        // this.headerModel.InvoiceDate = moment(model.Data[0].InvoiceDate).format('DD-MM-YYYY');
        // this.headerModel.OrderEstimate = moment(model.Data[0].OrderEstimate).format('DD-MM-YYYY');
        // this.headerModel.OwnerDescription = model.Data[0].OwnerCode + ' - ' + model.Data[0].OwnerName;
        // this.headerModel.ShiptoDescription = model.Data[0].ShiptoCode + ' - ' + model.Data[0].ShiptoName;

        // this.headerModel = model.Data;

        // this.isMainPage = false;
        // this.isFormPage = true;

        // this.readTimeline(param);
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

  readTimeline(param) {
    // this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "TransportNo": param.TransportNo,
      "OrderNo": param.OrderNo
    }

    // this.headerModel = param;
    // this.headerModel.DriverFirstName = '';
    // this.headerModel.DriverFirstName = this.headerModel.DriverFirstName + ' ' + this.headerModel.DriverLastName;

    let json = JSON.stringify(criteria);
    this.isDelivery = false;
    this.serviceProviderService.post('api/Transport/GetTransportOrderStatus', criteria).subscribe(data => {
      // this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {
        this.timelineModel = model.Data[0];
        // this.headerModel = model.Data[0];

        // this.headerModel.OrderEstimate = moment(model.Data[0].OrderEstimate).format('DD-MM-YYYY');
        // this.headerModel.OwnerDescription = model.Data[0].OwnerCode + ' - ' + model.Data[0].OwnerName;
        // this.headerModel.ShiptoDescription = model.Data[0].ShiptoCode + ' - ' + model.Data[0].ShiptoName;

        // // this.headerModel = model.Data;

        // this.isMainPage = false;
        // this.isFormPage = true;

      }
      else {
        // this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  formatDateTime(param) {
    if (param == '' || param == undefined)
      return '';
    else
      return moment(param).format('DD/MM/YYYY HH:mm:ss');
  }

  formatDate(param) {
    if (param == '' || param == undefined)
      return '';
    else
      return moment(param).format('DD/MM/YYYY');
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

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: false, height: '150px', width: '300px', data: { title: 'คุณต้องการยกเลิกใช่หรือไม่?' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
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
    });
  }

  setSeq(param, idx) {
    param = idx;
    return param;
  }

  // If can't load data to list model.
  private loadDataFalse(message): any {
    let _listModel: any = [];
    this.showErrorMessage(message);

    return _listModel;
  }

  // Show Error message.
  private showErrorMessage(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  readTransport() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria).subscribe(data => {
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listTransport = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
  }

  chooseTransportFilter() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: {
        title: 'Transport',
        listData: this.listTransport,
        listDataSearch: this.listTransport
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportId = result.Id;
        this.criteriaModel.TransportCode = result.Code;
        this.criteriaModel.TransportDescription = result.Code + ' - ' + result.Description;
        // Declare setting local criteria model.
        // let _criteriaModel = {
        //   'TransportId'          : result.Id,
        //   'TransportCode'        : result.Code,
        //   'TransportDescription' : result.Code + ' - ' + result.Description
        // }
        // // Setting header model.
        // _criteriaModel = this.setModel(_criteriaModel);
        // this.criteriaModel = {...this.criteriaModel, ..._criteriaModel};
      }
    });
  }

  //use
  chooseTransportNo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TransportNoDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Transport No.' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.TransportNo = result.TransportNo;
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
    const dialogRef = this.dialog.open(ShipToDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานที่รับ-ส่งสินค้า' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.ShiptoId = result.Id;
        this.criteriaModel.ShiptoCode = result.Code;
        this.criteriaModel.ShiptoAddress = result.Address;
        this.criteriaModel.ShiptoDescription = result.Code + ' - ' + result.CustomerName;
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
    const dialogRef = this.dialog.open(StatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานะเอกสาร' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.transportstatusCode = result.Code;
        this.criteriaModel.transportstatusDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  chooseJobOrderStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(JobOrderStatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานะ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.OrderStatus = result.Id;
        this.criteriaModel.OrderStatus = result.Code;
        this.criteriaModel.JobOrderStatusDescription = result.Code + ' - ' + result.Description;
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
    const dialogRef = this.dialog.open(TypeOfWorkDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ประเภทงาน' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TypeOfWorkDialog result: ', result)

      if (result != undefined) {
        this.criteriaModel.TransportTypeId = result.Id;
        this.criteriaModel.TransportTypeCode = result.Code;
        this.criteriaModel.TransportTypeDescription = result.Code + ' - ' + result.Description;
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
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก', listData: this.listRoute, listDataSearch: this.listRoute }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Code + ' - ' + result.Description;
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
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ทะเบียนรถ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.VehicleId = result.Id;
        this.criteriaModel.VehicleCode = result.Code;
        this.criteriaModel.VehicleDescription = result.Code + ' - ' + result.Description;
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
    const dialogRef = this.dialog.open(DriverDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'คนขับ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.DriverId = result.Id;
        this.criteriaModel.DriverCode = result.Code;
        this.criteriaModel.DriverDescription = result.Code + ' - ' + result.FirstName + ' ' + result.LastName;
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
    // this.read();

    window.scroll(0, 0);
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
    this.criteriaModel = {
      OrderEstimate: this.verifyDateTime('')
    };

    this.criteriaModelStatus.startDate = this.verifyDateTime('');
    this.criteriaModelStatus.endDate = this.verifyDateTime('');

    // const startDate = new Date();
    // const endDate = new Date();
    // this.criteriaModel.startDate = moment(startDate).format('YYYYMMDD');
    // this.criteriaModel.endDate = moment(endDate).format('YYYYMMDD');
  }

  public handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  statusTransportColor(param) {
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
      default:
        break;
    }

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

  openMap(param) {
    let arr = param.split(',');
    window.open('https://www.google.com/maps/search/?api=1&query=' + arr[0] + '%2C' + arr[1], '_blank');
  }

  timerModel: any = { displayMinute: '15', autoRefresh: false };
  displayMinuteTmp: any;
  msSinceEpoch: any;
  timeLater: any;
  showNextTime: any;

  autoRefresh() {
    // console.log('autoRefresh', this.timerModel.autoRefresh);
    if (this.timerModel.autoRefresh) {
      // Display Timer temp for new timer loop.
      this.displayMinuteTmp = this.timerModel.displayMinute;

      let today = new Date();

      this.msSinceEpoch = today.getTime();
      this.timeLater = new Date(this.msSinceEpoch + this.timerModel.displayMinute * 60 * 1000);
      this.showNextTime = 'โหลดข้อมูลใหม่ เวลา : ' + moment(this.timeLater).format('HH:mm:ss');

      // console.log(this.timerModel.displayMinute + ' minute later Refresh Data Next Time', this.showNextTime);
      // console.log('autoRefresh is true displayMinute', this.timerModel.displayMinute);

      GlobalConstants.interValtimer = setInterval(() => {
        let iToday = new Date();

        // console.log(moment(iToday).format('YYYY-MM-DD HH:mm:ss'), moment(this.timeLater).format('YYYY-MM-DD HH:mm:ss'));
        if (moment(iToday).format('YYYY-MM-DD HH:mm:ss') == moment(this.timeLater).format('YYYY-MM-DD HH:mm:ss')) {

          // Check if timeLater date is greater than time later change endDate.
          if ((moment(this.timeLater).format('YYYYMMDD') > moment(today).format('YYYYMMDD'))) {
            this.criteriaModelStatus.startDate = moment(this.timeLater).format('YYYYMMDD');
            this.criteriaModelStatus.endDate = moment(this.timeLater).format('YYYYMMDD');
          }

          // Refresh data.
          // console.log('Refresh Data call method: readAll()');
          this.readAll();

          // Clear interval timer when timeLater is equal current time.
          clearInterval(GlobalConstants.interValtimer);
          this.autoRefresh();
        }
      }, 1000);
    } else {
      this.timerModel.displayMinute = this.displayMinuteTmp ? this.displayMinuteTmp : this.timerModel.displayMinute;
      this.showNextTime = '';
      // Clear interval timer when auto refresh not checked.
      clearInterval(GlobalConstants.interValtimer);
      // console.log('autoRefresh is false displayMinute', this.timerModel.displayMinute);
    }
  }

  edit() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TrackingStatusEditDialog, { disableClose: false, height: '300px', width: '600px', data: { title: 'แก้ไขข้อมูล', invoiceNo: this.headerModel.InvoiceNo, orderNo: this.headerModel.OrderNo, transportNo: this.headerModel.TransportNo, actualDate: this.headerModel.DeliveryCheckInDate, driverReturnDate: this.headerModel.DriverReturnDate } });

    debugger
    dialogRef.afterClosed().subscribe(result => {
      console.log('TypeOfWorkDialog result: ', result)

      if (result != undefined) {

        debugger
        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "TransportNo": this.headerModel.TransportNo,
          "OrderNo": this.headerModel.OrderNo,
          "DeliveryCheckInDate": result.actualDate == "Invalid date" ? "" : moment(result.actualDate).format('YYYY-MM-DDT00:00:00'),
          "DriverReturnDate": result.returnDate == "Invalid date" ? "" : moment(result.returnDate).format('YYYY-MM-DDT00:00:00'),
        }

        let str = JSON.stringify(criteria);

        this.serviceProviderService.post('api/Transport/UpdateTrackingStatus', criteria).subscribe(data => {
          // this.spinner.hide();
          let model: any = {};
          model = data;
          // this.viewModel = model;

          if (model.Status) {
            this.spinner.hide();
            this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            debugger
            this.readDetail(result);
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
    });
  }

}
