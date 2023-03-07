import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, RouteDialog,  VehicleDialog } from '../dialog/dialog';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  templateUrl: './master-vehicle.component.html',
  styleUrls: ['./master-vehicle.component.css']
})
export class MasterVehicleComponent implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [];
  headerModel: any = {};
  criteriaModel: any = {} //ค้นหา
  criteria: object = { 
    "userinformation": this.serviceProviderService.userinformation
  };
  title: string = 'เพิ่มข้อมูล';
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  dateControl = new FormControl(moment().format('YYYYMMDD'));
  listVehicleType: any = [];

  mode: any = 'create';

  p = 1;

  listGroupUser: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.read();
    this.readVehicleType();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    this.headerModel.Operation = 'SELECT';
    
    let criteria = {
      "Fillter": this.criteriaModel.Fillter,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/GetVehicle', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      this.viewModel = model;

      if (model.Status) {
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

  // Set Header Model.
  setHeaderModel(model) {
    // Setting header model.
    for (const key in model) {
      this.headerModel[key] = model[key];
    } 
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
  chooseVehicleType() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false, 
      height: '400px', 
      width: '800px', 
      data: { title: 'Truck Type', 
        listData: this.listVehicleType, 
        listDataSearch: this.listVehicleType 
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(result);

      if (result != undefined) {
         // Declare setting local criteria model.
         let _criteriaModel = {
          vehicleTypeId: result.TypeId,
          VehicleTypeCode: result.Code,
          VehicleTypeDescription: result.Description,
        }
        // Setting header model.
        this.setHeaderModel(_criteriaModel);
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
        data: { title: 'ทะเบียนรถ' } 
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
  
        if (result != undefined) {
          // Declare setting local criteria model.
          let _criteriaModel = {
            vehicleId: result.Id,
            vehicleCode: result.Code,
            vehicleTypeId: result.TypeId,
            vehicleDescription: result.Code + ' - ' + result.Description,
          }
          // Setting header model.
          this.setHeaderModel(_criteriaModel);
        }
      });
    }

  readDetail(param) {
    this.spinner.show();

    let criteria = {
      "Id": param.Id
    }
    criteria = {...this.criteria, ...criteria};

    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  clear() {
    this.criteriaModel = {};
  }

  add() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id : 'Auto',
      Code : '',
      Description : '',
      Active : 'Y',
      VehicleTypeId : '',
      VehicleTypeCode : '',
      VehicleTypeDescription : '',
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
  }

  save() {
    this.spinner.show();

    let criteria = {
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "VehicleTypeId": this.headerModel.VehicleTypeId,
      "Code": this.headerModel.Code,
      "Description": this.headerModel.Description,
      "Active": this.headerModel.Active,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveVehicle', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      console.log(data);
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
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.spinner.show();

        this.headerModel.Operation = 'DELETE';
        let criteria = {
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveVehicle', criteria)
        .subscribe(data => {
          this.spinner.hide();
          let model: any = data;
          this.viewModel = model;

          if (model.Status) {
            this.toastr.success('เสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.back();
          }
          else {
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
