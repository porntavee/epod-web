import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceProviderService } from '../shared/service-provider.service';
import { ConfirmDialog ,RoutingDialog, SubRoutingDialog,
  RegionDialog, ProvinceDialog, DistrictDialog } from '../dialog/dialog';
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
    
    // Call service provider service to get shiplocation data.
    this.serviceProviderService.post('api/Masters/GetShipto', _criteria)
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

  // Set Model Fo.
  private setChooseModel(model) {
    // Set model.
    let _model: any = model;
    for (const key in model) {
      _model[key] = model[key];
    }

    return _model;
  }

  // If sucess load data.
  private showSuccessMessage(message: string): void {
    this.spinner.hide();
    this.toastr.success(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    this.backToMainPage();
  }

  // Set Header Model.
  private setHeaderOrCriteriaModel(model, type): any {
    // Set model.
    let _model: any = {};
    let _keys = Object.keys(model);

    _keys.forEach((key) => { 
      _model[key] = type == 'header' ? this.headerModel[key] : this.criteriaModel[key];
    });

    return _model;
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
  
  // Set to Form Page.
  goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  // Set back to main page.
  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }
    

  // Set form for update.
  setForm(param) {
    // Show spinner.
    this.spinner.show();
    Logger.info('master-shiplocation', 'setForm', param, this.isDebugMode)

    // Set header model.
    this.headerModel = param;
    // Set Operation to UPDATE
    this.headerModel.Operation = 'UPDATE';

    // Set to from page.
    this.goToFromPage();
  }

  // Clear Model and Reload Table Data.
  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    // Clear headerModel.
    this.headerModel = {};

    // Reload Table data.
    this.render();
  }

  // Set form for add.
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
    Object.keys(_headerModel).forEach((key) => { 
      this.headerModel[key] = _headerModel[key];
    })

    // Set to from page.
    this.goToFromPage();
  }

  // Save data.
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

    this.serviceProviderService.post('api/Masters/CreateCustomerLocation', _criteria)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      if (model.Status) {
        this.showSuccessMessage('บันทึกยกเลิกเสร็จสิ้น');
      } else {
        this.showErrorMessage(model.Message);
      }

    }, err => {
      this.showErrorMessage(err.message);
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
          (model.Status) ? this.showSuccessMessage('เสร็จสิ้น') : this.showErrorMessage(model.Message);
        }, err => {
          this.showErrorMessage(err.message);
        });
        // Clear criteriaModel and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  // Choose main route for filter.
  chooseMainRouteFilter() {
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
          RouteDescription: result.Code + ' - ' + result.Description
        }
      } else {
        _headerModel = {
          RouteId: '',
          RouteCode: '',
          Route: ''
        }
      }
    });
  }

  // Choose main route for add form.
  chooseMainRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' }
    });

    dialogRef.afterClosed().subscribe(result => {
      let _subroutetHeaderModel: object = {
        SubRouteId: '',
        SubRouteCode: '',
        SubRoute: ''
      }
      // Setting header model.
      _subroutetHeaderModel = this.setChooseModel(_subroutetHeaderModel);
      this.headerModel = {...this.headerModel, ..._subroutetHeaderModel};

      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          RouteId: result.Id,
          RouteCode: result.Code,
          Route: result.Description
        }
      } else {
        _headerModel = {
          RouteId: '',
          RouteCode: '',
          Route: ''
        }
      }

      // Setting header model.
      _headerModel = this.setChooseModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
    });
  }

  // Choose sub route for add form.
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
      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          SubRouteId: result.Id,
          SubRouteCode: result.Code,
          SubRoute: result.Description
        }
      } else {
        _headerModel = {
          SubRouteId: '',
          SubRouteCode: '',
          SubRoute: ''
        }
      }

      // Setting header model.
      _headerModel = this.setChooseModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
    });
  }

  // Choose region for add form.
  chooseRegion() {
    const dialogRef = this.dialog.open(RegionDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'โซน' }
    });

    dialogRef.afterClosed().subscribe(result => {
      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          RegionId: result.Id,
          RegionCode: result.Code,
          Region: result.Description
        }
      } else {
        _headerModel = {
          RegionId: '',
          RegionCode: '',
          Region: ''
        }
      }

      // Setting header model.
      _headerModel = this.setChooseModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
    });
  }

  // Choose province for add form.
  chooseProvince() {
    const dialogRef = this.dialog.open(ProvinceDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'จังหวัด' }
    });

    dialogRef.afterClosed().subscribe(result => {
      let _districtHeaderModel: object = {
        DistrictId: '',
        DistrictCode: '',
        District: ''
      }
      // Setting header model.
      _districtHeaderModel = this.setChooseModel(_districtHeaderModel);
      this.headerModel = {...this.headerModel, ..._districtHeaderModel};

      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          ProvinceId: result.Id,
          ProvinceCode: result.Code,
          Province: result.Description
        }
      } else {
        _headerModel = {
          ProvinceId: '',
          ProvinceCode: '',
          Province: ''
        }
      }

      // Setting header model.
      _headerModel = this.setChooseModel(_headerModel);
      this.headerModel = {...this.headerModel, ..._headerModel};
      Logger.info('master-subroute', 'chooseRouteAddForm-SetHeaderModel', this.headerModel, this.isDebugMode);
    });
  }

  // Choose district for add form.
  chooseDistrict() {
    if(this.headerModel.ProvinceId == ''){
      this.toastr.error('กรุณาระบุจังหวัด', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }
    
    const dialogRef = this.dialog.open(DistrictDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'อำเภอ' ,ProvinceId : this.headerModel.ProvinceId }
    });

    dialogRef.afterClosed().subscribe(result => {
      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          DistrictId: result.Id,
          DistrictCode: result.Code,
          District: result.Description
        }
      } else {
        _headerModel = {
          DistrictId: '',
          DistrictCode: '',
          District: ''
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