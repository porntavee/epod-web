import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { E } from '@angular/cdk/keycodes';
import { Component, Inject, KeyValueDiffers, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, DriverDialog, JobStatusDialog, RegionDialog, RouteDialog,
  RoutingDialog, ShipToDialog,StatusDialog, SubRoutingDialog, TypeOfWorkDialog,
  VehicleDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { Logger } from '../shared/logger.service';
import { PermissionService } from '../shared/permission.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  templateUrl: './order-transport-form.component.html',
  styleUrls: ['./order-transport-form.component.css']
})
export class OrderTransportFormComponent implements OnInit, AfterContentChecked {

  isDebugMode: boolean = true;
  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  criteriaModel: any = {} //ค้นหา
  criteria: object = {}; // User Information.
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
  currentPage = 1;

  listTransport: any = [];
  listRoute: any = [];
  listSubRoute: any = [];
  listVehicleType: any = [];

  formModel: any = {};
  listFormModel: any = [];

  itemSelected = false;
  id: any = '';
  GroupCode: any = '';

  permission: any; // <----- Permission ส่งเข้า Read เพื่อให้เห็นเฉพาะ Category ที่ถูกเซตไว้กับ Role สรุปคือ (Category Code List)
  permissionList: any; // <----- PermissionList ไว้สำหรับตรวจสอบว่า Category มีสิทธิ์ในการ Create Read Update Read หรือเปล่า

  constructor(public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService,
    public changeDetector: ChangeDetectorRef) {

    this.route.queryParams.subscribe(params => {
      let model: any = this.route.snapshot.params;
      Logger.info('order-transport-form', 'ngOnInit', typeof(this.id), this.isDebugMode);
      this.id = model.id;
    });

    this.criteria =  {
      "userinformation": this.serviceProviderService.userinformation 
    }

    this.GroupCode = this.serviceProviderService.userinformation.GroupCode;

    Logger.info('order-transport-form', 'ngOnInit-permission',this.criteria , this.isDebugMode);

    const date = new Date();
    this.criteriaModel.TransportDateString = moment(date.setDate(date.getDate() + 1)).format('YYYYMMDD');
  }

  ngOnInit(): void {
    this.readTransport();
    this.readVehicleType();

    Logger.info('order-transport-form', 'ngOnInit', this.id, this.isDebugMode);
    if (this.id != 'new') {
      this.read();
    }
  }

  // Set Header Model.
  setCriteriaModel(model) {
    // Setting header model.
    for (const key in model) {
      this.criteriaModel[key] = model[key];
    } 
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "TransportNo": this.id
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Transport/GetTransportHeader', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      this.viewModel = model;
      if (model.Status) {
        this.criteriaModel = model.Data[0];
        let criteria = {
          TransportDescription: model.Data[0].Transport,
          ReceiveFromDescription: model.Data[0].ReceiveFromName,
          RouteDescription: model.Data[0].Route,
          TransportTypeDescription: model.Data[0].TransportType,
          SubRouteDescription: model.Data[0].SubRoute,
          TransportShiptoDescription: model.Data[0].TransportShitptoName,
          DriverDescription: model.Data[0].DriverFirstName,
          Plant: model.Data[0].Plant,
          TransportShiptoAddress: model.Data[0].TransportShitptoAddress,
          VehicleDescription: model.Data[0].Vehicle,
          VehicleTypeDescription: model.Data[0].VehicleType,
          TransportDateString: moment(model.Data[0].TransportDate).format('YYYYMMDD')
        }
        criteria = {...this.criteria, ...criteria};
        Logger.info('order-transport-form', 'read', criteria, this.isDebugMode);
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      this.viewModel = model;
      if (model.Status) {

        this.listModel = model.Data;

        model.Data.forEach(element => {
          element.OrderEstimateStr = moment(element.OrderEstimate).format('DD-MM-YYYY');
          element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
        });
      } else {
        this.spinner.hide();
        // this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  //use
  readTransport() {
    let criteria = {
      "Code": ""
    }
    criteria = {...this.criteria, ...criteria};

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;
      if (model.Status) {
        this.listTransport = model.Data;
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  //use
  readRoute() {
    let criteria = {
      "Code": ""
    }
    criteria = {...this.criteria, ...criteria};

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetRoute', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.listRoute = model.Data;
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  //use
  readSubRoute() {
    let criteria = {
      "Code": "",
      "RouteId": this.criteriaModel.routeId,
    }
    criteria = {...this.criteria, ...criteria};

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetSubRoute', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.listSubRoute = model.Data;

        //ต้องเอาไปใส่ใน app.module ที่ declarations
        const dialogRef = this.dialog.open(RouteDialog, { 
          disableClose: false, 
          height: '400px',
          width: '800px',
          data: { title: 'Sub Route', listData: this.listSubRoute, listDataSearch: this.listSubRoute } });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);

          if (result != undefined) {
            let criteria = {
              'SubRouteId': "",
              'SubRouteCode': this.criteriaModel.routeId,
              'SubRouteDescription': result.Code + "-" + result.Description
            }
            this.setCriteriaModel(criteria);
          }
        });

      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  //use
  readVehicleType() {
    let criteria = {
      "Code": ""
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/GetVehicleType', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;
      if (model.Status) {
        this.listVehicleType = model.Data;
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readActivityType() {
    this.serviceProviderService.post('api/B1/GetActivityType', this.criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.listActivityType = model.Data;
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readFinancialProject() {
    this.serviceProviderService.post('api/B1/GetFinancialProject', this.criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.listFinancialProject = model.Data;
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readCostCenter() {
    //Get CostCenter
    let criteriaEmp = {
      "empID": this.model.UserID
    }
    criteriaEmp = {...this.criteria, ...criteriaEmp};

    this.serviceProviderService.post('api/B1/Employees', criteriaEmp)
    .subscribe(data => {
      // this.spinner.hide();
      let model: any = data;
      // this.viewModel = model;

      if (model.Status) {
        this.costCenter = model.Data[0].CostCenter;

      } else {
        // this.spinner.hide();
        // this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      // this.spinner.hide();
      // this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  editTimeSheet(param) {

    this.mode = 'edit';
    this.models = [];

    if (param.Code != undefined) {
      this.title = 'Info';
      this.model = param;
      this.model.DateFrom = moment(this.model.DateFrom, 'DD-MM-YYYY').format('YYYYMMDD');
      this.model.DateTo = moment(this.model.DateTo, 'DD-MM-YYYY').format('YYYYMMDD');

      this.readCostCenter();

      let criteria = {
        "AbsEntry": this.model.AbsEntry,
      }
      criteria = {...this.criteria, ...criteria};

      this.serviceProviderService.post('api/TimeSheet/GetTimeSheetDetail', criteria)
      .subscribe(data => {
        // this.spinner.hide();
        let model: any = {};
        model = data;
        // this.viewModel = model;

        if (model.Status) {
          this.models = model.Data;

          this.models.forEach(element => {
            element.ActType = element.ActType.toString();

            let endTime = (parseFloat(element.EndTimeText.substr(0, 2)) * 60) + parseFloat(element.EndTimeText.substr(3, 5));
            let startTime = (parseFloat(element.StartTimeText.substr(0, 2)) * 60) + parseFloat(element.StartTimeText.substr(3, 5));
            element.U_HMC_Hour = (endTime - startTime) / 60;
          });

        } else {
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

  newTimeSheet() {

    this.mode = 'create';
    this.model = {};
    this.models = [];
    this.isMainPage = false;
    this.isFormPage = true;
    this.isTimeSheetPage = false;
  }

  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
  }

  update() {
    // this.toastr.warning('รอ API', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //api/TimeSheet/UpdateTimeSheet
    this.spinner.show();

    let TimeSheetDetail = this.models;
    let TimeSheetDetailMapping = [];
    TimeSheetDetail.forEach(element => {
      TimeSheetDetailMapping.push({
        "LineID": element.LineID,
        "Date": moment(element.Date).format('YYYY-MM-DD'),
        "StartTime": element.StartTimeText,
        "U_HMC_Hour": element.U_HMC_Hour,
        "EndTime": element.EndTimeText,
        "ActivityType": parseFloat(element.ActType),
        "FinancialProject": element.FiProject,
        "CostCenter": element.CostCenter,
        "Break": element.BreakText.length == 4 ? element.BreakText.substr(0, 2) + ':' + element.BreakText.substr(2, 4) : element.BreakText,
        "NonBillableTime": element.NonBillTmText.length == 4 ? element.NonBillTmText.substr(0, 2) + ':' + element.NonBillTmText.substr(2, 4) : element.NonBillTmText,
        "U_HMC_Stage": element.U_HMC_Stage,
        "U_HMC_Detail": element.U_HMC_Detail
      });
    });


    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "AbsEntry": this.model.AbsEntry,
      "UserID": this.model.UserID,
      "DateFrom": moment(this.model.DateFrom).format('YYYY-MM-DD'),
      "DateTo": moment(this.model.DateTo).format('YYYY-MM-DD'),
      "TimeSheetDetail": TimeSheetDetailMapping
    }

    this.serviceProviderService.post('api/TimeSheet/UpdateTimeSheet', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        // this.read();
        this.backToMain();
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  delete() {
    // const dialogRef = this.dialog.open(ConfirmDeleteDialog, { disableClose: true });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);

    //   if (result) {
    //     this.spinner.show();

    //     let criteria = {
    //       "UserInformation": {
    //         "UserName": localStorage.getItem('a'),
    //         "Password": localStorage.getItem('b'),
    //         "empID": localStorage.getItem('empID'),
    //         "dbName": localStorage.getItem('company'),
    //       },
    //       "AbsEntry": this.model.AbsEntry
    //     }

    //     let json = JSON.stringify(criteria);

    //     this.serviceProviderService.post('api/TimeSheet/DelTimeSheet', criteria).subscribe(data => {
    //       this.spinner.hide();
    //       let model: any = {};
    //       model = data;
    //       this.viewModel = model;

    //       if (model.Status) {
    //         this.spinner.hide();
    //         this.toastr.success('Delete Success.', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //       }
    //       else {
    //         this.spinner.hide();
    //         this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //       }

    //     }, err => {
    //       this.spinner.hide();
    //       this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //     });
    //   }
    // });
  }

  deleteLine(param, idx) {
    if (param.LineID != undefined) {
      this.spinner.show();

      let criteria = {
        "userinformation": this.serviceProviderService.userinformation,
        "AbsEntry": param.AbsEntry,
        "LineID": param.LineID

      }

      this.serviceProviderService.post('api/TimeSheet/DelTimeSheetLine', criteria)
      .subscribe(data => {
        this.spinner.hide();
        let model: any = {};
        model = data;
        this.viewModel = model;

        if (model.Status) {
          this.editTimeSheet(this.model);
          this.spinner.hide();
          this.toastr.success('Delete Success.', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        } else {
          this.spinner.hide();
          this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        }

      }, err => {
        this.spinner.hide();
        this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      });
    }
    else {
      this.models.splice(idx, 1);
    }
  }

  calEndTime(event, param) {

    // var timestring1 = "2013-05-09T00:00:00Z";
    // var timestring2 = "2013-05-09T02:00:00Z";
    // var startdate = moment(timestring1);
    // var expected_enddate = moment(timestring2);
    // var returned_endate = moment(startdate).add(2, 'hours');
    // var travelTime = moment().add(11, 'minutes').format('hh:mm A');


    // let startTime = '12:30:00';
    // let durationInMinutes = '120';
    // let endTime = moment(startTime, 'HH:mm:ss').add(durationInMinutes, 'minutes').format('HH:mm');
    let startTime = param.StartTimeText;
    let durationInMinutes = parseFloat(event.target.value) * 60;
    param.EndTimeText = moment(startTime, 'HH:mm').add(durationInMinutes, 'minutes').format('HH:mm');

    // endTime is equal to "14:30"
    // console.log('hello');

    // Cal EffectTm
    if (param.BreakText == undefined || param.BreakText == '' || param.BreakText == '00:00' || param.BreakText == '0000') {
      // param.EffectTmText = moment(parseFloat(event.target.value), 'hour').format('HH:mm');
      param.EffectTmText = moment.utc(event.target.value * 3600 * 1000).format('HH:mm')
    }
    else {

      let breakMinute = (parseFloat(param.BreakText.substr(0, 2)) * 60) + parseFloat(param.BreakText.substr(2, 4));
      // param.EffectTmText = moment(parseFloat(event.target.value), 'hour').format('HH:mm');
      let effectMinute = parseFloat(event.target.value) * 60;
      let effectTotalHour = (effectMinute - breakMinute) / 60;

      if (effectTotalHour < 0) {
        this.toastr.error('EffectTm ติดลบ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        param.EffectTmText = "00:00";
      } else
        // param.EffectTmText = moment(effectTotalHour, 'hour').format('HH:mm');
        param.EffectTmText = moment.utc(effectTotalHour * 3600 * 1000).format('HH:mm')
    }

    // Call BillableTm
    if (param.NonBillTmText == undefined || param.NonBillTmText == '' || param.NonBillTmText == '00:00') {
      param.BillableTmText = param.EffectTmText;
    }
    else {
      let nonBillMinute = (parseFloat(param.NonBillTmText.substr(0, 2)) * 60) + parseFloat(param.NonBillTmText.substr(2, 4));
      // param.EffectTmText = moment(parseFloat(event.target.value), 'hour').format('HH:mm');
      let effectMinute = (parseFloat(param.EffectTmText.substr(0, 2)) * 60) + parseFloat(param.EffectTmText.substr(3, 5));
      let billTotalHour = (effectMinute - nonBillMinute) / 60;

      if (billTotalHour < 0) {
        this.toastr.error('BillableTm ติดลบ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        param.BillableTmText = "00:00";
      } else
        // param.BillableTmText = moment(billTotalHour, 'hour').format('HH:mm');
        param.BillableTmText = moment.utc(billTotalHour * 3600 * 1000).format('HH:mm')
    }
  }

  calEffectTm(event, param) {

    //EndTime - Break = EffectTm
    let endTimeMinutes = parseFloat(param.U_HMC_Hour) * 60;
    let breakMinutes = (parseFloat(event.target.value.substr(0, 2)) * 60) + parseFloat(event.target.value.substr(2, 4)); //00:00
    let effectTotalHour = (endTimeMinutes - breakMinutes) / 60;

    if (effectTotalHour < 0) {
      this.toastr.error('EffectTm ติดลบ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      param.EffectTmText = "00:00";
    }
    else
      // param.EffectTmText = moment(effectTotalHour, 'hour').format('HH:mm');
      param.EffectTmText = moment.utc(effectTotalHour * 3600 * 1000).format('HH:mm')


    // Call BillableTm
    if (param.NonBillTmText == undefined || param.NonBillTmText == '' || param.NonBillTmText == '00:00' || param.NonBillTmText == '0000') {
      param.BillableTmText = param.EffectTmText;
    }
    else {
      let nonBillMinute = (parseFloat(param.NonBillTmText.substr(0, 2)) * 60) + parseFloat(param.NonBillTmText.substr(2, 4));
      // param.EffectTmText = moment(parseFloat(event.target.value), 'hour').format('HH:mm');
      let effectMinute = (parseFloat(param.EffectTmText.substr(0, 2)) * 60) + parseFloat(param.EffectTmText.substr(3, 5));
      let billTotalHour = (effectMinute - nonBillMinute) / 60;

      if (billTotalHour < 0) {
        this.toastr.error('BillableTm ติดลบ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        param.BillableTmText = "00:00";
      } else
        // param.BillableTmText = moment(billTotalHour, 'hour').format('HH:mm');
        param.BillableTmText = moment.utc(billTotalHour * 3600 * 1000).format('HH:mm')
    }
  }

  calBillTm(event, param) {

    //EndTime - Break = EffectTm
    let endTimeMinutes = (parseFloat(param.EffectTmText.substr(0, 2)) * 60) + parseFloat(param.EffectTmText.substr(3, 5));
    let nonBillMinutes = (parseFloat(event.target.value.substr(0, 2)) * 60) + parseFloat(event.target.value.substr(2, 4));
    let billTotalHour = (endTimeMinutes - nonBillMinutes) / 60;

    if (billTotalHour < 0) {
      this.toastr.error('BillTm ติดลบ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      param.BillableTmText = "00:00";
    }
    else
      // param.EffectTmText = moment(effectTotalHour, 'hour').format('HH:mm');
      param.BillableTmText = moment.utc(billTotalHour * 3600 * 1000).format('HH:mm')
  }

  //use
  chooseTransport() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'Transport', listData: this.listTransport, listDataSearch: this.listTransport } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportId = result.Id;
        this.criteriaModel.TransportCode = result.Code;
        this.criteriaModel.TransportDescription = result.Code + ' - ' + result.Description;
      }
    });
  }

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.criteriaModel.SubRouteId = '';
      this.criteriaModel.SubRouteCode = '';
      this.criteriaModel.SubRouteDescription = '';

      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Description;
      } else {
        this.criteriaModel.RouteId = '';
        this.criteriaModel.RouteCode = '';
        this.criteriaModel.RouteDescription = '';
      }
    });
  }

  chooseSubRoute() {
    if(this.criteriaModel.RouteId == '' || this.criteriaModel.RouteId == undefined){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    const dialogRef = this.dialog.open(SubRoutingDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางย่อย' ,RouteId : this.criteriaModel.RouteId} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.SubRouteId = result.Id;
        this.criteriaModel.SubRouteCode = result.Code;
        this.criteriaModel.SubRouteDescription = result.Description;
      } else {
        this.criteriaModel.SubRouteId = '';
        this.criteriaModel.SubRouteCode = '';
        this.criteriaModel.SubRouteDescription = '';
      }
    });
  }

  chooseRegion() {
    const dialogRef = this.dialog.open(RegionDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'โซน' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.RegionId = result.Id;
        this.criteriaModel.RegionCode = result.Code;
        this.criteriaModel.Region = result.Description;

      } else {
        this.criteriaModel.RegionId = '';
        this.criteriaModel.RegionCode = '';
        this.criteriaModel.Region = '';
      }
    });
  }
  //use
  chooseReceiveFrom() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'สถานที่' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.ReceiveFromId = result.Id;
        this.criteriaModel.ReceiveFromCode = result.Code;
        this.criteriaModel.ReceiveFromAddress = result.Address;
        this.criteriaModel.ReceiveFromDescription = result.Code + ' - ' + result.CustomerName;
      }
    });
  }

  //use
  chooseTransportShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'สถานที่',IsHub :'Y' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportShiptoId = result.Id;
        this.criteriaModel.TransportShiptoCode = result.Code;
        this.criteriaModel.TransportShiptoAddress = result.Address;
        this.criteriaModel.TransportShiptoDescription = result.Code + ' - ' + result.CustomerName;
      }
    });
  }

  //use
  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'Ship to' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.formModel.ShiptoId = result.Id;
        this.formModel.ShiptoCode = result.Code;
        this.formModel.ShiptoAddress = result.Address;
        this.formModel.ShiptoDescription = result.Code + ' - ' + result.CustomerName;
      }
    });
  }

  //use
  chooseTypeOfWork() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TypeOfWorkDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'สถานะเอกสาร' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportTypeId = result.Code;
        this.criteriaModel.TransportTypeDescription = result.Code + ' - ' + result.Description;

      }
    });
  }

  //use
  chooseStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(JobStatusDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'สถานะเอกสาร' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.formModel.StatusCode = result.Code;
        this.formModel.StatusDescription = result.Code + ' - ' + result.Description;
      }
    });
  }

  //use
  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'คนขับ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        //Driver
        this.criteriaModel.DriverId = result.Id;
        this.criteriaModel.DriverCode = result.Code;
        this.criteriaModel.DriverDescription = result.FirstName + ' ' + result.LastName;
        this.criteriaModel.DriverMobile = result.Mobile;

        //Vehicle
        this.criteriaModel.VehicleId = result.VehicleId;
        this.criteriaModel.VehicleCode = result.VehicleCode;
        this.criteriaModel.VehicleDescription = result.Vehicle;
      
        //VehicleType
        this.criteriaModel.VehicleTypeId = result.VehicleTypeId;
        this.criteriaModel.VehicleTypeCode = result.VehicleTypeCode;
        this.criteriaModel.VehicleTypeDescription = result.VehicleType;
      }
    });
  }

  //use
  chooseVehicle() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'ทะเบียนรถ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.VehicleId = result.Id;
        this.criteriaModel.VehicleCode = result.Code;
        this.criteriaModel.VehicleDescription = result.Description;
      
        this.criteriaModel.VehicleTypeId = result.VehicleTypeId;
        this.criteriaModel.VehicleTypeCode = result.VehicleTypeCode;
        this.criteriaModel.VehicleTypeDescription = result.VehicleType;
      }
    });
  }

  //use
  chooseVehicleType() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'Truck Type', listData: this.listVehicleType, listDataSearch: this.listVehicleType } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      
      if (result != undefined) {

        this.criteriaModel.VehicleTypeId = result.Id;
        this.criteriaModel.VehicleTypeCode = result.Code;
        this.criteriaModel.VehicleTypeDescription = result.Description;
      }
    });
  }

  chooseFinancialProject(param) { }

  chooseStage(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "FinancialProject": param.FiProject
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/B1/GetStage', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;


      if (model.Status) {
        this.listStage = model.Data;

        // const dialogRef = this.dialog.open(StageDialog, { disableClose: false, height: '400px',width: '800px',data: { title: 'Stage', listData: this.listStage, listDataSearch: this.listStage } });

        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);

        //   if (result != undefined) {
        //     param.U_HMC_Stage = result.U_HMC_Stage;
        //   }
        // });
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  reportModel: any = [];
  exportAsXLSX(param): void {

    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "DocNum": param.DocNum
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('/api/B1/getTimeSheetLog', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      // this.viewModel = model;

      if (model.Status) {
        // this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        // this.read();
        this.reportModel = model.Data


        // const dialogRef = this.dialog.open(DocLogDialog, { disableClose: false, height: '400px',width: '800px',data: { title: 'Doc Log Report', listData: this.reportModel, listDataSearch: this.reportModel } });

        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);

        //   if (result != undefined) {
        //      this.excelService.exportAsExcelFile(result, 'doc-log-report');
        //   }
        // });

      } else {
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
    excelModel.push({ 
        'Code': 'First Name', [this.model.Code]: this.model.FirstName, ' ': '',
        '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '',
        'Doc Num': 'Date From', [' ' + this.model.DocNum]: moment(this.model.DateFrom).format('DD-MM-YYYY'),
        '        ': '', '         ': '' 
      }, { 'Code': 'Last Name', [this.model.Code]: this.model.LastName, ' ': '',
        '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '',
        'Doc Num': 'Date To', [' ' + this.model.DocNum]: moment(this.model.DateTo).format('DD-MM-YYYY'),
        '        ': '', '         ': ''
      }, {
        'Code': '', [this.model.Code]: '', ' ': '', '  ': '', '   ': '', '    ': '',
        '     ': '', '      ': '', '       ': '', 'Doc Num': '', [' ' + this.model.DocNum]: '',
        '        ': '', '         ': ''
      }, {
        'Code': 'Date', [this.model.Code]: 'Start Time', ' ': 'Hour', '  ': 'End Time',
        '   ': 'Activity Type', '    ': 'Financial Project', '     ': 'Cost Center',
        '      ': 'Stage', '       ': 'Break', 'Doc Num': 'Nonbillable Time',
        [' ' + this.model.DocNum]: 'Effective Time', '        ': 'Billable Time',
        '         ': 'Detail' 
      });

    this.models.forEach(element => {
      excelModel.push({ 
          'Code': element.Date, [this.model.Code]: element.StartTimeText, ' ': element.U_HMC_Hour,
          '  ': element.EndTimeText, '   ': element.ActType, '    ': element.FiProject, '     ': element.CostCenter,
          '      ': element.U_HMC_Stage, '       ': element.BreakText,
          'Doc Num': element.NonBillTmText, [' ' + this.model.DocNum]: element.EffectTmText,
          '        ': element.BillableTmText, '         ': element.U_HMC_Detail 
      });
    });
    this.excelService.exportAsExcelFile(excelModel, 'timesheet-report');
    // this.excelService.exportAsExcelFile(this.listModel, 'user-log-report');
    this.spinner.hide();
  }

  add() {
    if(this.criteriaModel.TransportStatus == 'A' 
    || this.criteriaModel.TransportStatus == 'O' 
    || this.criteriaModel.TransportStatus== undefined) {
      this.isMainPage = false;
      this.isFormPage = true;
  
      this.readOrder('');
    } else {
      this.toastr.error('สถานะไม่สามารถเพิ่มงานขนส่งได้', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    }
  }

  addOrder() {
    this.listFormModel.forEach(element => {
      if (element.isSelected) {
        let dup = this.listModel.filter(c => c.InvoiceNo == element.InvoiceNo);

        if (dup.length == 0) {
          element.Process = 'CREATE';
          this.listModel.push(element);
        }
      }
    });

    this.isMainPage = true;
    this.isFormPage = false;

    window.scroll(0, 0);
  }

  deleteOrder(idx) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องลบรายการใช่หรือไม่?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {

        let criteria: any = {};
        criteria.userinformation = this.serviceProviderService.userinformation;
        criteria.Process = 'DELETEITEM';
        criteria.TransportNo = this.criteriaModel.TransportNo;
        criteria.OrderNo = this.listModel[idx].OrderNo;

        this.serviceProviderService.post('api/Transport/DeleteTransportItem', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          if (model.Status) {
            this.toastr.success("ลบรายการเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.read();
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });

        this.listModel.splice(idx, 1);
      }
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listModel, event.previousIndex, event.currentIndex);
  }

  clear() {
    this.formModel = { OrderDateString: '' };
  }

  readOrder(param) {

    if(param!='')
    {
      if (param.key === "Enter") {
        if (this.criteriaModel.InvoiceNo == '' && this.criteriaModel.OrderNo == '') {
          this.toastr.error('กรุณาระบุเงื่อนไขเอกสาร', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          return;
        }
      } else{
        return;
      }
    }


    this.spinner.show();
    this.formModel.OrderStatus = this.formModel.StatusCode;
    this.formModel.userinformation = this.serviceProviderService.userinformation;
    this.formModel.Process = 'TRANSPORT';
    this.formModel.OrderDate = this.criteriaModel.OrderDateString != undefined &&
      this.criteriaModel.OrderDateString != "Invalid date" ?
      moment(this.criteriaModel.OrderDateString).format('YYYY-MM-DD 00:00:00.000') : undefined;

    this.serviceProviderService.post('api/Transport/GetOrder', this.formModel)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {
          element.OrderEstimateStr = moment(element.OrderEstimate).format('DD-MM-YYYY');
          element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
        });

        this.listFormModel = model.Data;
      } else {
        this.listFormModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  checkUncheckAll() {
    this.listFormModel.forEach(element => {
      element.isSelected = this.itemSelected;
    });
  }

  validation() {
    if (this.criteriaModel.ReceiveFromId == null) {
      this.toastr.warning('กรุณาระบุ สถานที่รับสินค้า', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return false;
    }
    if (this.criteriaModel.TransportTypeId == null) {
      this.toastr.warning('กรุณาระบุ Type of work', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return false;
    }
    if (this.criteriaModel.RouteId == null) {
      this.toastr.warning('กรุณาระบุ Route', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return false;
    }
    if (this.criteriaModel.SubRouteId == null) {
      this.toastr.warning('กรุณาระบุ SubRoute', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return false;
    }
    if (this.criteriaModel.TransportTypeId == 'XD') {
      if (this.criteriaModel.TransportShiptoId == null 
        || this.criteriaModel.TransportShiptoId == '' 
        || this.criteriaModel.TransportShiptoId == undefined){
          this.toastr.warning('Type of Work เป็น X Dock กรุณาระบุสถานที่ส่งสินค้า', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          return
      }

    }

    return true;
  }

  create() {
    if (!this.validation()) { return; }


    this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
    this.criteriaModel.TransportNo = "";
    this.criteriaModel.TransportDate = moment(this.criteriaModel.TransportDateString).format('YYYY-MM-DDT00:00:00');
    this.criteriaModel.TransportStatus = "A";

    this.criteriaModel.RegionId = "0010000000000";
    this.criteriaModel.CreateBy = "0010000000000";

    let json = JSON.stringify(this.criteriaModel);

    this.serviceProviderService.post('api/Transport/CreateTransport', this.criteriaModel)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.criteriaModel.TransportNo = model.Data;
        this.toastr.success("สร้างใบคุมเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });

        let item: any = {};
        item.userinformation = this.serviceProviderService.userinformation;
        item.TTRANSPORTDS = [];

        this.listModel.forEach(element => {
          item.TTRANSPORTDS.push({
            "TransportNo": model.Data,
            "OrderNo": element.OrderNo,
            "OrderStatus": "O",
            "ShiptoId": this.criteriaModel.TransportTypeId == "XD" ? this.criteriaModel.TransportShiptoId : ""
          })
        });

        this.serviceProviderService.post('api/Transport/CreateTransportIem', item)
        .subscribe(data => {
          // this.spinner.hide();
          let model: any = {};
          model = data;
          // this.viewModel = model;

          if (model.Status) {
            // this.criteriaModel.TransportNo = model.Data;
            this.toastr.success("สร้างงานขนส่งเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.id = this.criteriaModel.TransportNo;
            this.read();
            // this.listModel = model.Data;
            // this.router.navigate(['order-transport']);
          } else {
            // this.listModel = [];
            this.spinner.hide();
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
        // this.listModel = model.Data;
      } else {
        // this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  close() {
    window.self.close();
  }

  closeJob() {
    // Logger.info('order-transport', 'closeJob', "Close Job", this.isDebugMode);

    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องการปิดงานใบคุมใช่หรือไม่?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.spinner.show();

        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "TransportNo": this.criteriaModel.TransportNo ,
          "Process": 'ADMINCLOSEJOB' ,
        }

        this.serviceProviderService.post('api/Transport/AdminCloseJob', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.spinner.hide();
            this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.read();
            // this.backToMain();
          } else {
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

  edit() {

    this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
    this.criteriaModel.Process = 'UPDATE';
    this.criteriaModel.TransportDate = moment(this.criteriaModel.TransportDateString).format('YYYY-MM-DDT00:00:00');

    this.serviceProviderService.post('api/Transport/CreateTransport', this.criteriaModel)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
        this.criteriaModel.TransportNo = model.Data;
        this.toastr.success("อัพเดทใบคุมเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });

        let item: any = {};
        item.userinformation = this.serviceProviderService.userinformation;
        item.TTRANSPORTDS = [];

        this.listModel.forEach(element => {
          if(element.Process =='CREATE')
          {
            item.TTRANSPORTDS.push({
              "TransportNo": model.Data,
              "OrderNo": element.OrderNo,
              "Process": element.Process,
              "ShiptoId": this.criteriaModel.TransportTypeId == "XD" ? this.criteriaModel.TransportShiptoId : ""
            })
          }

        });

        this.serviceProviderService.post('api/Transport/CreateTransportIem', item)
        .subscribe(data => {
          // this.spinner.hide();
          let model: any = {};
          model = data;
          // this.viewModel = model;

          if (model.Status) {
            // this.criteriaModel.TransportNo = model.Data;
            this.toastr.success("อัพเดทงานขนส่งเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.id = this.criteriaModel.TransportNo;
            this.read();
            // this.listModel = model.Data;
            // this.router.navigate(['order-transport']);
          } else {
            // this.listModel = [];
            this.spinner.hide();
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
        // this.listModel = model.Data;
      } else {
        // this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  confirm() {

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องยืนยันใบคุมใช่หรือไม่?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.spinner.show();

        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "TransportNo": this.criteriaModel.TransportNo ,
          "TransportStatus": 'O' ,
        }

        this.serviceProviderService.post('api/Transport/UpdateTransportStatus', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.spinner.hide();
            this.toastr.success('บันทึกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.backToMain();
          } else {
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

  // Fixing "Expression has changed after it was checked"
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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

  // statusOrderClassify(param) {
  //   switch (param) {
  //     case 'C':
  //       return '#E16E5B'
  //     case 'D':
  //       return '#F7E884'
  //     case 'L':
  //       return '#F7E884'
  //     case 'O':
  //       return '#B6B6B6'
  //     case 'P':
  //       return '#79D58B'
  //     case 'R':
  //       return '#79D58B'
  //     case 'S':
  //       return '#66A5D9'
  //     case 'W':
  //       return '#B6B6B6'
  //     case 'F':
  //       return '#EBB146'
  //       case 'H':
  //         return '#66A5D9'
  //     default:
  //       break;
  //   }
  // }
}

