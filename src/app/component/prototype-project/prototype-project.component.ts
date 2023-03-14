import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, RouteDialog } from '../../dialog/dialog';
import { Logger } from '../../shared/logger.service';
import { ServiceProviderService } from '../../shared/service-provider.service';

@Component({
  selector: 'prototype',
  templateUrl: './prototype-project.component.html',
  styleUrls: ['./prototype-project.component.css']
})
export class PrototypeProjectComponent implements OnInit, AfterContentChecked {

  mode            : string  = 'create';
  title           : string  = 'เพิ่มข้อมูล';
  api             : string = 'api/Masters/GetVehicle';
  isDebugMode     : boolean = true;
  isMainPage      : boolean = true;
  isFormPage      : boolean = false;
  isTimeSheetPage : boolean = false;
  headerModel     : any     = {};
  criteriaModel   : any     = {} //ค้นหา
  criteria        : any     = {}; // User Information.
  model           : any     = {}; //ข้อมูล Form
  models          : any     = []; //ข้อมูลในตารางหน้า Form
  listModel       : any     = []; //ข้อมูลในตารางหน้า Main
  listDetailModel : any     = [];
  listGroupUser   : any     = [];
  timeSheetModel  : any     = {};
  viewModel       : any     = {};
  listVehicleType : any     = [];
  dateControl     : object  = {};
  currentPage     : number  = 1;
  
  
  constructor(public dialog: MatDialog,
    public serviceProviderService : ServiceProviderService,
    public spinner                : NgxSpinnerService,
    public toastr                 : ToastrService,
    public changeDetector         : ChangeDetectorRef) {
      // Initialize the criteria.
      this.criteria = {
        "userinformation": this.serviceProviderService.userinformation
      }
      // Initialize the date control.
      this.dateControl = new FormControl(moment().format('YYYYMMDD'));
    }

  ngOnInit(): void {
    // Initialize the render method.
    this.render();
    this.readVehicleType();
  }
  
  // Grid configuration and render.
	public render(): void {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "Fillter": this.criteriaModel.Fillter,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('prototype', 'render-criteria', criteria, this.isDebugMode)
    
    // Request Data From API.
    this.serviceProviderService.post(this.api, criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.loadDataError(err.message);
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
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });

    return _listModel;
  }

  // If error load data.
  private loadDataError(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // Set go to form page.
  private goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  // Set back to main page.
  public backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  // Set data to form Page.
  public setFormData(param: any) {
    this.spinner.show();

    let _criteria = {
      "Id": param.Id
    }
    _criteria = {...this.criteria, ..._criteria};

    let _headerModel = {
      Operation: 'UPDATE'
    }
    _headerModel = {...param, ..._headerModel};

    // Setting header model.
    this.headerModel = this.setModel(_headerModel);

     // Set to from page.
     this.goToFromPage();
  }

  public resetFormData() {
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
   this.headerModel = this.setModel(_headerModel);
   // Set to from page.
   this.goToFromPage();
  }

  public save() {
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
      if (model.Status) {
        this.spinner.hide();
        this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.backToMainPage();
      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  public delete(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false,
      height: '150px',
      width: '300px',
      data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?'} 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-vehicle', 'delete', result, this.isDebugMode)
      
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
            this.backToMainPage();
          } else {
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

  public clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    Logger.info('prototype', 'clearAndReloadData', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  //use
  public readVehicleType() {
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

  //use
  public chooseVehicleType() {
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
      Logger.info('prototype', 'chooseVehicleType', result, this.isDebugMode)
      if (result != undefined) {
         // Declare setting local criteria model.
         let _headerModel = {
          VehicleTypeId: result.Id,
          VehicleTypeCode: result.Code,
          VehicleTypeDescription: result.Description,
        }
        // Setting header model.
        _headerModel = this.setModel(_headerModel);
        this.headerModel = {...this.headerModel, ..._headerModel};
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
