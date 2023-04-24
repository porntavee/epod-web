import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, RouteDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';


@Component({
  templateUrl: './master-vehicle.component.html',
  styleUrls: ['./master-vehicle.component.css']
})
export class MasterVehicleComponent implements OnInit, AfterContentChecked {

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
  listVehicleType : any     = [];
  currentPage     : number  = 1;
  
  constructor(
    public dialog                  : MatDialog,
    private spinner                : NgxSpinnerService,
    private toastr                 : ToastrService,
    private changeDetector         : ChangeDetectorRef,
    private serviceProviderService : ServiceProviderService
  ){
    // Initialize userinformation to criteria object.
    this.criteria = { 
      "userinformation": this.serviceProviderService.userinformation
    };
  }

  ngOnInit(): void {
    // Initialize the render method.
    this.render();
    this.getAllVehicleType();
  }

  // Grid configuration and render.
	render(): void {
    // Show spinner.
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "Fillter": this.criteriaModel.Fillter,
      "IsMaintenance": (this.criteriaModel.IsMaintenance == undefined || this.criteriaModel.IsMaintenance == false) ? '' : 'Y',
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-vehicle', 'render-criteria', criteria, this.isDebugMode)
    
    // Request Data From API.
    this.serviceProviderService.post('api/Masters/GetVehicle', criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
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
    this.showErrorMessage(message);

    return _listModel;
  }

  // If sucess load data.
  private showSuccessMessage(message: string) {
    this.spinner.hide();
    this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // If error load data.
  private showErrorMessage(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  // Set go to form page.
  private goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }

  //use
  private getAllVehicleType() {
    let criteria = {
      "Code": ""
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/GetVehicleType', criteria)
    .subscribe(data => {
      let model: any = data;
      this.viewModel = model;
      this.listVehicleType = model.Status ? 
        model.Data : 
        this.showErrorMessage(model.Message);
    }, err => {
      this.showErrorMessage(err.Message);
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

  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    Logger.info('master-vehicle', 'clearAndReloadData', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  // Set data to form Page.
  setFormData(param: any) {
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

  addForm() {
    // Show spinner.
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
      IsMaintenance:''
    }
    // Setting header model.
    this.headerModel = this.setModel(_headerModel);
    // Set to from page.
    this.goToFromPage();
  }

  // Set back to main page.
  backToMainPage() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  save() {
    // Show spinner.
    this.spinner.show();

    let criteria = {
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "VehicleTypeId": this.headerModel.VehicleTypeId,
      "Code": this.headerModel.Code,
      "Description": this.headerModel.Description,
      "IsMaintenance": this.headerModel.IsMaintenance,
      "Active": this.headerModel.Active,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveVehicle', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      if (model.Status) {
        this.showSuccessMessage('บันทึกยกเลิกเสร็จสิ้น');
        this.backToMainPage();
      } else {
        this.showErrorMessage(model.Message);
      }
    }, err => {
      this.showErrorMessage(err.message);
    });
  }

  delete(param: any) {
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

        let criteria = {
          "Operation" : 'DELETE',
          "Id"        : param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveVehicle', criteria)
        .subscribe(data => {
          this.spinner.hide();

          let model: any = data;
          this.viewModel = model;
          if (model.Status) {
            this.showSuccessMessage('เสร็จสิ้น');
            this.backToMainPage();
          } else {
            this.showErrorMessage(model.Message);
          }
        }, err => {
          this.showErrorMessage(err.message);
        });
        // Clear criteriaModel and Reload Table Data.
        this.clearAndReloadData();
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}
