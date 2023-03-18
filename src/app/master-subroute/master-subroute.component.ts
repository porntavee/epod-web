import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, RoutingDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  selector: 'app-master-subroute',
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

  // Render SubRoute Table.
  render() {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    // Set criteriaModel to criteria For Filter.
    let _criteria = {
      RouteId : '',
      Fillter : ''
    }
    _criteria = this.setHeaderOrCriteriaModel(_criteria, 'criteria');
    _criteria = {...this.criteria, ..._criteria};
    Logger.info('master-subroute', 'render', _criteria, this.isDebugMode)

    // Call service provider service to get sub route data.
    this.serviceProviderService.post('api/Masters/GetSubRoute', _criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model an view model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
  }

  // Set Model.
  private setChooseModel(model): any {
    let _model: any = model;
    for (const key in model) {
      _model[key] = model[key];
    }

    return _model;
  }

  // Set Header or Criteria Model.
  private  setHeaderOrCriteriaModel(model, type): any {
    let _model: any = {};
    let _keys = Object.keys(model);

    _keys.forEach((key) => { 
      _model[key] = type == 'header' ? this.headerModel[key] : this.criteriaModel[key];
    });

    return _model;
  }

  // If can't load data to list model.
  private loadDataFalse(message): boolean {
    let _listModel: any = [];
    this.showErrorMessage(message);

    return _listModel;
  }

  // Show success message when data is loaded.
  private showSuccessMessage(message: string): void {
    this.spinner.hide();
    this.toastr.success(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    this.backToMainPage();
  }

  // Show error message when can't load data .
  private showErrorMessage(message: string): void {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }
  
  // Go to Form Page.
  goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  // Back to main page.
  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  // Set form for update.
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

    // go to from page.
    this.goToFromPage();
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

  // Set form for add.
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
    Object.keys(_headerModel).forEach((key) => { 
      this.headerModel[key] = _headerModel[key];
    })

    // Set to from page.
    this.goToFromPage();
  }

  // Save data.
  save() {
    if(this.headerModel.RouteId == '' || this.headerModel.RouteId == undefined) {
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }
    // Set back to main page.
    this.spinner.show();

    let _criteria = {
       Operation : '',
       RouteId : '',
       Id : '',
       Code : '',
       Description : '',
       Active : '',
    }
    _criteria = this.setHeaderOrCriteriaModel(_criteria, 'header');
    _criteria = {...this.criteria, ..._criteria};
    Logger.info('master-shiplocation', 'save', _criteria, this.isDebugMode)

    this.serviceProviderService.post('api/Masters/SaveSubRoute', _criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      (model.Status) ? this.showSuccessMessage('บันทึกยกเลิกเสร็จสิ้น') : this.showErrorMessage(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
    // Clear Model and Reload Table Data.
    this.clearAndReloadData();
  }

  // Delete data.
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
          (model.Status) ? this.showSuccessMessage('เสร็จสิ้น') : this.showErrorMessage(model.Message);
        }, err => {
          this.showErrorMessage(err.message);
        });
        // Clear Model and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  // Choose Route for Filter.
  chooseRouteFilter() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info('master-shiplocation', 'chooseRouteFilter', result, this.isDebugMode)
      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel =  {
          RouteId : result.Id,
          RouteCode : result.Code,
          RouteDescription : result.Description
        }
      } else {
        _headerModel =  {
          RouteId : '',
          RouteCode : '',
          RouteDescription : ''
        }
      }

      // Setting header model.
      _headerModel = this.setChooseModel(_headerModel);
      this.criteriaModel = {...this.criteriaModel, ..._headerModel};
      
      Logger.info('master-shiplocation', 'chooseRouteFilter', this.criteriaModel, this.isDebugMode)
    });
  }

  // Choose Route for Add Form.
  chooseRouteAddForm() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      let _headerModel: object = {};
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
      _headerModel = this.setChooseModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
      Logger.info('master-subroute', 'chooseRouteAddForm-SetHeaderModel', this.headerModel, this.isDebugMode);
    });
  }

   // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}