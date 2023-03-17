import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog ,RoutingDialog, SubRoutingDialog,RegionDialog,ProvinceDialog,DistrictDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';

@Component({
  selector: 'app-master-shiplocation',
  templateUrl: './master-shiplocation.component.html',
  styleUrls: ['./master-shiplocation.component.css']
})
export class MasterShiplocationComponent implements OnInit, AfterContentChecked {

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

  // Table configuration and render.
  render() {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    // Set criteriaModel to criteria For Filter.
    let _criteria = {
      Code         : '',
      CustomerName : '',
      Address      : '',
      Mobile       : '',
      ContractName : '',
      RouteId      : '',
      SubRouteId   : '',
      DistrictId   : '',
      ProvinceId   : '',
      IsHub: (this.criteriaModel.IsHub == undefined || this.criteriaModel.IsHub == false) ? '' : 'Y',
    }
    _criteria = this.setHeaderOrCriteriaModel(_criteria, 'criteria');
    _criteria = {...this.criteria, ..._criteria};
    Logger.info('master-shiplocation', 'render', _criteria, this.isDebugMode)
    
    this.serviceProviderService.post('api/Masters/GetShipto', _criteria)
    .subscribe(data => {
      // Logger.info('master-shiplocation', 'render', data, this.isDebugMode)

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
  private setHeaderModelForAddForm(model): any {
    // Set model.
    let _model: any = {};
    let _keys = Object.keys(model);

    _keys.forEach((key) => { 
      _model[key] = model[key];
    })

    return _model;
  }

  // Set Header Model.
  private  setHeaderOrCriteriaModel(model, type): any {
    // Set model.
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

  setForm(param) {
    // Show spinner.
    this.spinner.show();
    Logger.info('master-shiplocation', 'setForm', param, this.isDebugMode)

    // Set header model.
    this.headerModel = param;
    // Set Operation to UPDATE
    this.headerModel.Operation = 'UPDATE';

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
      Operation    : 'INSERT',
      Id           : 'Auto',
      Code         : '',
      CustomerName : '',
      Address      : '',
      ContractName : '',
      Mobile       : '',
      District     : '',
      Province     : '',
      PostCode     : '',
      Region       : '',
      Route        : '',
      SubRoute     : '',
      Latitude     : '',
      Longtitude   : '',
      Active       : 'Y',
      DistrictId   : '',
      ProvinceId   : '',
      RegionId     : '',
      RouteId      : '',
      SubRouteId   : ''
    }

    // Setting header model.
    this.headerModel = this.setHeaderModelForAddForm(_headerModel);
    // Set to from page.
    this.setToFromPage();
  }

  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  save() {
    this.spinner.show();

    let _criteria = {
      Operation    : '', 
      Id           : '',
      Code         : '',
      CustomerName : '',
      Address      : '',
      ContractName : '',
      Mobile       : '',
      District     : '',
      Province     : '',
      PostCode     : '',
      Region       : '',
      Route        : '',
      SubRoute     : '',
      Latitude     : '',
      Longtitude   : '',
      Active       : '',
      DistrictId   : '',
      ProvinceId   : '',
      RegionId     : '',
      RouteId      : '',
      SubRouteId   : '',
      Hub          : ''
    }
    _criteria = this.setHeaderOrCriteriaModel(_criteria, 'header');
    _criteria = {...this.criteria, ..._criteria};
    Logger.info('master-shiplocation', 'save', _criteria, this.isDebugMode)

    this.serviceProviderService.post('api/Masters/CreateCustomerLocation', _criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      if (model.Status) {
        this.hideSninnerAndShowSuccess('บันทึกยกเลิกเสร็จสิ้น');
        this.backToMainPage();
      } else {
        this.hideSninnerAndShowError(model.Message);
      }

    }, err => {
      this.hideSninnerAndShowError(err.message);
    });
    // Clear criteriaModel and Reload Table Data.
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
      console.log(`Dialog result: ${result}`);

      if (result) {
         this.spinner.show();

        let criteria = {
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/DeleteCustomerLocation', criteria)
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
        // Clear criteriaModel and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  chooseMainRouteFilter() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Code + ' - ' + result.Description;
      } else {
        this.criteriaModel.RouteId = '';
        this.criteriaModel.RouteCode = '';
        this.criteriaModel.RouteDescription = '';
      }
    });
  }

  chooseMainRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.headerModel.SubRouteId = '';
      this.headerModel.SubRouteCode = '';
      this.headerModel.SubRoute = '';

      if (result != undefined) {
        this.headerModel.RouteId = result.Id;
        this.headerModel.RouteCode = result.Code;
        this.headerModel.Route = result.Description;
      } else {
        this.headerModel.RouteId = '';
        this.headerModel.RouteCode = '';
        this.headerModel.Route = '';
      }
    });
  }

  chooseSubRoute() {
    if(this.headerModel.RouteId == ''){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    const dialogRef = this.dialog.open(SubRoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางย่อย' ,RouteId : this.headerModel.RouteId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.headerModel.SubRouteId = result.Id;
        this.headerModel.SubRouteCode = result.Code;
        this.headerModel.SubRoute = result.Description;
      } else {
        this.headerModel.SubRouteId = '';
        this.headerModel.SubRouteCode = '';
        this.headerModel.SubRoute = '';
      }
    });
  }

  chooseRegion() {
    const dialogRef = this.dialog.open(RegionDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'โซน' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.headerModel.RegionId = result.Id;
        this.headerModel.RegionCode = result.Code;
        this.headerModel.Region = result.Description;
      } else {
        this.headerModel.RegionId = '';
        this.headerModel.RegionCode = '';
        this.headerModel.Region = '';
      }
    });
  }

  chooseProvince() {
    const dialogRef = this.dialog.open(ProvinceDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'จังหวัด' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.headerModel.DistrictId = '';
      this.headerModel.DistrictCode = '';
      this.headerModel.District = '';

      if (result != undefined) {
        this.headerModel.ProvinceId = result.Id;
        this.headerModel.ProvinceCode = result.Code;
        this.headerModel.Province = result.Description;
      } else {
        this.headerModel.ProvinceId = '';
        this.headerModel.ProvinceCode = '';
        this.headerModel.Province = '';
      }
    });
  }

  chooseDistrict() {
    if(this.headerModel.ProvinceId == ''){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }
    
    const dialogRef = this.dialog.open(DistrictDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'อำเภอ' ,ProvinceId : this.headerModel.ProvinceId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.headerModel.DistrictId = result.Id;
        this.headerModel.DistrictCode = result.Code;
        this.headerModel.District = result.Description;
      } else {
        this.headerModel.DistrictId = '';
        this.headerModel.DistrictCode = '';
        this.headerModel.District = '';
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
}