import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog } from '../dialog/dialog';
import { ServiceProviderService } from '../shared/service-provider.service';
import { Logger } from '../shared/logger.service';


@Component({
  templateUrl: './master-transport.component.html',
  styleUrls: ['./master-transport.component.css']
})
export class MasterTransportComponent  implements OnInit, AfterContentChecked {

  isDebugMode     : boolean = true;
  isMainPage      : boolean = true;
  isFormPage      : boolean = false;
  isTimeSheetPage : boolean = false;
  headerModel     : any     = {};
  criteriaModel   : any     = {}; //ค้นหา
  criteria        : any     = {}; // User Information.
  model           : any     = {}; //ข้อมูล Form
  models          : any     = []; //ข้อมูลในตารางหน้า Form
  listModel       : any     = []; //ข้อมูลในตารางหน้า Main
  viewModel       : any     = {};
  listVehicleType : any     = [];
  currentPage     : number  = 1;
  listDetailModel : any = [];
  listGroupUser   : any = [];

  constructor(
    public dialog                  : MatDialog,
    private spinner                : NgxSpinnerService,
    private toastr                 : ToastrService,
    private changeDetector         : ChangeDetectorRef,
    private serviceProviderService : ServiceProviderService
  ){
    this.criteria = { 
      "userinformation": this.serviceProviderService.userinformation
    }; // User Information.
  }

  ngOnInit(): void {
    this.render();
  }

  // Grid configuration and render.
	render(): void {
    this.spinner.show();
    // Reset current page to 1 for search.
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    let criteria = {
      "Fillter": this.criteriaModel.Fillter,
    }
    criteria = {...this.criteria, ...criteria};
    Logger.info('master-transport', 'read', criteria, this.isDebugMode)
    
    // Request Data From API.
    this.serviceProviderService.post('api/Masters/GetTransport', criteria)
    .subscribe(data => {
      // Hidden spinner when load data successfuly.
      this.spinner.hide();
      // Set data to model.
      let model: any = data;
      this.viewModel = model;

      // Check model status if true set model data to list model.
      this.listModel = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.hideSninnerAndShowError(err.message);
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
  private loadDataFalse(message) {
    let _listModel: any = [];
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });

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

  // Set go to form page.
  private goToFromPage() {
    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
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

  clearAndReloadData() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    Logger.info('master-vehicle', 'clearAndReloadData', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  addForm() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id : 'Auto',
      Code : '',
      Description : '',
      Active: 'Y'
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
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Operation": this.headerModel.Operation,
      "Id": this.headerModel.Id,
      "Code": this.headerModel.Code,
      "Description": this.headerModel.Description,
      "Active": this.headerModel.Active,
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveTransport', criteria)
    .subscribe(data => {
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
      Logger.info('master-transport', 'delete', result, this.isDebugMode)

      if (result) {
         this.spinner.show();

         this.headerModel.Operation = 'DELETE';
        let criteria = {
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveTransport', criteria)
        .subscribe(data => {
          this.spinner.hide();
  
          let model: any = data;
          this.viewModel = model;
          if (model.Status) {
            this.hideSninnerAndShowSuccess('เสร็จสิ้น');
            this.backToMainPage();
          } else {
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }
        }, err => {
          this.hideSninnerAndShowError(err.message);
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
}
