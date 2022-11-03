import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RouteDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  selector: 'app-order-transport-form',
  templateUrl: './order-transport-form.component.html',
  styleUrls: ['./order-transport-form.component.css']
})
export class OrderTransportFormComponent implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = [
    {
      demo: 'demo1',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo2',
      status: 'เริ่มต้นปฏิบัติงาน',
    },
    {
      demo: 'demo3',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
    {
      demo: 'demo',
      status: 'ส่งสินค้าแล้ว',
    },
  ]; //ข้อมูลในตารางหน้า Main
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

  listTransport: any = [];
  listRoute: any = [];
  listSubRoute: any = [];
  listVehicleType: any = [];

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

    // this.read();
    // this.readEmployee();
    // this.readActivityType();
    // this.readFinancialProject();
    // this.readStage();

    this.readTransport();
    this.readRoute();
    this.readVehicleType();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      },
      "empID": this.criteriaModel.empID,
      "DocNum": this.criteriaModel.DocNum,
      "FirstName": this.criteriaModel.FirstName,
      "DateFrom": this.criteriaModel.DateFrom == 'Invalid date' ? '' : moment(this.criteriaModel.DateFrom).format('YYYY-MM-DD'),
      "Code": this.criteriaModel.Code,
      "LastDateFrom": this.criteriaModel.LastDateFrom == 'Invalid date' ? '' : moment(this.criteriaModel.LastDateFrom).format('YYYY-MM-DD'),
      "LastDateTo": this.criteriaModel.LastDateTo == 'Invalid date' ? '' : moment(this.criteriaModel.LastDateTo).format('YYYY-MM-DD'),
      // "FirstName": this.criteriaModel.FirstName,
      // "DateFrom": this.criteriaModel.DateFrom
    }


    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/TimeSheet/GetTimeSheet', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;


      if (model.Status) {

        model.Data.forEach(element => {
          element.DateFrom = moment(element.DateFrom).format('DD-MM-YYYY');
          element.DateTo = moment(element.DateTo).format('DD-MM-YYYY');
          element.LastDate = moment(element.LastDate).format('DD-MM-YYYY');
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

  //use
  readTransport() {
    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "A",
        "dbName": "WTX-EPOD",
        "Version": "22.09.08.01"
      },
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listTransport = model.Data;
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

  //use
  readRoute() {
    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "A",
        "dbName": "WTX-EPOD",
        "Version": "22.09.08.01"
      },
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

  //use
  readSubRoute() {
    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "A",
        "dbName": "WTX-EPOD",
        "Version": "22.09.08.01"
      },
      "Code": "",
      "RouteId": this.criteriaModel.routeId,
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetSubRoute', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listSubRoute = model.Data;

        //ต้องเอาไปใส่ใน app.module ที่ declarations
        const dialogRef = this.dialog.open(RouteDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Sub Route', listData: this.listSubRoute, listDataSearch: this.listSubRoute } });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);

          if (result != undefined) {
            this.criteriaModel.subRouteId = result.Id;
            this.criteriaModel.subRouteCode = result.Code;
            this.criteriaModel.subRouteDescription = result.Code + ' - ' + result.Description;
            // param.Code = result.Code;
            // param.FirstName = result.firstName;
            // param.LastName = result.lastName;
            // param.UserID = result.empID;
            // this.costCenter = result.CostCenter;
          }
        });

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

  //use
  readVehicleType() {
    let criteria = {
      "userinformation": {
        "UserName": "dhong",
        "GroupCode": "A",
        "dbName": "WTX-EPOD",
        "Version": "22.09.08.01"
      },
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetVehicleType', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listVehicleType = model.Data;
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

  readActivityType() {
    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      }
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/B1/GetActivityType', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listActivityType = model.Data;
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

  readFinancialProject() {
    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      }
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/B1/GetFinancialProject', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listFinancialProject = model.Data;
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

  readCostCenter() {
    //Get CostCenter
    let criteriaEmp = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      },
      "empID": this.model.UserID
    }
    this.serviceProviderService.post('api/B1/Employees', criteriaEmp).subscribe(data => {
      // this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      debugger
      if (model.Status) {
        this.costCenter = model.Data[0].CostCenter;

      }
      else {
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
        "UserInformation": {
          "UserName": localStorage.getItem('a'),
          "Password": localStorage.getItem('b'),
          "empID": localStorage.getItem('empID'),
          "dbName": localStorage.getItem('company'),
        },
        "AbsEntry": this.model.AbsEntry,
        // "FirstName": this.criteriaModel.FirstName,
        // "DateFrom": this.criteriaModel.DateFrom
      }
      this.serviceProviderService.post('api/TimeSheet/GetTimeSheetDetail', criteria).subscribe(data => {
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

            // let FiProject = this.listFinancialProject.filter(c => c.PrjCode == element.FiProject);
            // if (FiProject.length > 0)
            //   element.FiProjectName = FiProject[0].PrjName;

            // this.readStage(element);

          });

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

  newTimeSheet() {

    this.mode = 'create';
    this.model = {};
    this.models = [];

    // if (this.listModel.length == 0) {
    //   this.toastr.warning('กรุณาค้นหาข้อมูลก่อน', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //   return
    // }

    // if (this.listModel[0].Code != undefined) {
    //   this.title = 'Info';
    //   this.model = this.listModel[0];
    //   this.model.DocNum = '';
    //   this.model.DateFrom = moment(new Date()).format('DD-MM-YYYY');
    //   this.model.DateTo = moment(new Date()).format('DD-MM-YYYY');

    //   this.readCostCenter();
    // }

    this.isMainPage = false;
    this.isFormPage = true;
    this.isTimeSheetPage = false;
  }

  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    // this.read();
    this.model = {};
    this.models = [];
    this.listModel = [];
  }

  create() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/order-transport-form`])
    );

    window.open(url, '_blank');
  }

  update() {
    // this.toastr.warning('รอ API', 'แจ้งเตือนระบบ', { timeOut: 5000 });
    //api/TimeSheet/UpdateTimeSheet

    this.spinner.show();

    let TimeSheetDetail = this.models;

    // "Date": "2022-04-20",
    // "StartTime": "08:00",
    // "U_HMC_Hour": "2",
    // "EndTime": "10:00",
    // "ActivityType": 1,
    // "FinancialProject": "21010001",
    // "CostCenter": "B00006",
    // "Break": "00:30",
    // "NonBillableTime": "00:05",
    // "U_HMC_Stage": "C01-วางแผนการทำงานประจำเดือน",
    // "U_HMC_Detail": "ทดสอบจ้าาาาาา"

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
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      },
      "AbsEntry": this.model.AbsEntry,
      "UserID": this.model.UserID,
      "DateFrom": moment(this.model.DateFrom).format('YYYY-MM-DD'),
      "DateTo": moment(this.model.DateTo).format('YYYY-MM-DD'),
      "TimeSheetDetail": TimeSheetDetailMapping
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/TimeSheet/UpdateTimeSheet', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        // this.read();
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
        "UserInformation": {
          "UserName": localStorage.getItem('a'),
          "Password": localStorage.getItem('b'),
          "empID": localStorage.getItem('empID'),
          "dbName": localStorage.getItem('company'),
        },
        "AbsEntry": param.AbsEntry,
        "LineID": param.LineID

      }

      let json = JSON.stringify(criteria);

      this.serviceProviderService.post('api/TimeSheet/DelTimeSheetLine', criteria).subscribe(data => {
        this.spinner.hide();
        let model: any = {};
        model = data;
        this.viewModel = model;

        if (model.Status) {
          this.editTimeSheet(this.model);
          this.spinner.hide();
          this.toastr.success('Delete Success.', 'แจ้งเตือนระบบ', { timeOut: 5000 });
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
      }
      else
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
      }
      else
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
      }
      else
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
    const dialogRef = this.dialog.open(RouteDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Transport', listData: this.listTransport, listDataSearch: this.listTransport } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.transportId = result.Id;
        this.criteriaModel.transportCode = result.Code;
        this.criteriaModel.transportDescription = result.Code + ' - ' + result.Description;
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
  chooseSubRoute() {

    if (this.criteriaModel.routeId == '' || this.criteriaModel.routeId == undefined)
    {
      this.toastr.warning('กรุณาเลือก Route ก่อน', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return
    }

    this.readSubRoute();
  }

  //use
  chooseVehicleType() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Truck Type', listData: this.listVehicleType, listDataSearch: this.listVehicleType } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {

        this.criteriaModel.truckTypeId = result.Id;
        this.criteriaModel.truckTypeCode = result.Code;
        this.criteriaModel.truckTypeDescription = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  chooseFinancialProject(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    // const dialogRef = this.dialog.open(FinancialProjectDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Financial Project', listData: this.listFinancialProject, listDataSearch: this.listFinancialProject } });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);

    //   if (result != undefined) {
    //     param.FiProject = result.PrjCode;
    //     param.FiProjectName = result.PrjName;
    //   }
    // });
  }

  chooseStage(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations

    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": "2",
        "dbName": localStorage.getItem('company'),
      },
      "FinancialProject": param.FiProject
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/B1/GetStage', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;


      if (model.Status) {
        this.listStage = model.Data;

        // const dialogRef = this.dialog.open(StageDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Stage', listData: this.listStage, listDataSearch: this.listStage } });

        // dialogRef.afterClosed().subscribe(result => {
        //   console.log(`Dialog result: ${result}`);

        //   if (result != undefined) {
        //     param.U_HMC_Stage = result.U_HMC_Stage;
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

  next() {
    this.isMainPage = false;
    this.isFormPage = true;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listModel, event.previousIndex, event.currentIndex);
  }

}

