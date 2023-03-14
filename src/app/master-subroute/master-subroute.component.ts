import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, RoutingDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  templateUrl: './master-subroute.component.html',
  styleUrls: ['./master-subroute.component.css']
})
export class MasterSubrouteComponent implements OnInit, AfterContentChecked {
  
  isDebugMode     : boolean = true;
  isMainPage      : boolean = true;
  isFormPage      : boolean = false;
  isTimeSheetPage : boolean = false;
  headerModel     : any     = {};
  criteriaModel   : any     = {}; //ค้นหา
  criteria        : any     = {}; // User Information.
  model           : any     = {}; //ข้อมูล Form
  listModel       : any     = []; //ข้อมูลในตารางหน้า Main
  viewModel       : any     = {};
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
    this.render();
  }

  // Grid configuration and render.
  render() {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "RouteId": this.criteriaModel.RouteId,
      "Fillter": this.criteriaModel.Fillter,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-subroute', 'render', criteria, this.isDebugMode)

    // Call service provider service to get sub route data.
    this.serviceProviderService.post('api/Masters/GetSubRoute', criteria)
    .subscribe(data => {
       // Hidden spinner when load data successfuly.
       this.spinner.hide();
       // Set data to model an view model.
       let model: any = data;
       this.viewModel = model;
       // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.hideSninnerAndShowError(err.message);
    });
  }

  // Set Model.
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

  setForm(param) {
    this.spinner.show();
    Logger.info('master-vehicle', 'setForm-param', param, this.isDebugMode)

    let criteria = {
      "Id": param.Id
    }
    this.criteria = {...this.criteria, ...criteria};

    this.headerModel = param;
    this.headerModel.Operation = 'UPDATE';
    this.headerModel.RouteDescription = param.Route;

    Logger.info('master-vehicle', 'setForm', this.headerModel, this.isDebugMode)
    // Set to from page.
    this.setToFromPage();
  }

  // Clear Model and Reload Table Data.
  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    this.headerModel = {};
    Logger.info('master-vehicle', 'clearAndReloadData', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  addForm() {
    // Show spinner.
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
    this.headerModel = this.setModel(_headerModel);
    // Set to from page.
    this.setToFromPage();
  }

  // Set back to main page.
  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  save() {

    if(this.headerModel.RouteId == '' || this.headerModel.RouteId == undefined) {
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }
    // Set back to main page.
    this.spinner.show();

    let criteria = {
      "Operation": this.headerModel.Operation,
      "RouteId": this.headerModel.RouteId,
      "Id": this.headerModel.Id,
      "Code": this.headerModel.Code,
      "Description": this.headerModel.Description,
      "Active": this.headerModel.Active,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveSubRoute', criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      if (model.Status) {
        this.hideSninnerAndShowSuccess('บันทึกยกเลิกเสร็จสิ้น');
        this.backToMainPage();
      }
      else {
        this.hideSninnerAndShowError(model.Message);
      }

    }, err => {
      this.hideSninnerAndShowError(err.message);
    });
    // Clear Model and Reload Table Data.
    this.clearAndReloadData();
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
            this.hideSninnerAndShowSuccess('เสร็จสิ้น');
            this.backToMainPage();
          } else {
            this.hideSninnerAndShowError(model.Message);
          }
        }, err => {
          this.hideSninnerAndShowError(err.message);
        });
        // Clear Model and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  chooseRouteFilter() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-subroute', 'chooseRoute2', result, this.isDebugMode)

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

  chooseRouteAddForm() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-subroute', 'chooseRouteAddForm', result, this.isDebugMode);
      let _headerModel: object = {}
      if (result != undefined) {
        _headerModel = {
          RouteId: result.Id,
          RouteCode: result.Code,
          RouteDescription: result.Description
        }
      } else {
        _headerModel = {
          RouteId: '',
          RouteCode: '',
          RouteDescription: ''
        }
      }
      // Setting header model.
      _headerModel = this.setModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
      Logger.info('master-subroute', 'chooseRouteAddForm-SetHeaderModel', this.headerModel, this.isDebugMode);
    });
  }

   // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}