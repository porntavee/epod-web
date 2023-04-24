import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, CountryDialog } from '../dialog/dialog';
import { Logger } from '../shared/logger.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  templateUrl: './master-route.component.html',
  styleUrls: ['./master-route.component.css']
})
export class MasterRouteComponent implements OnInit, AfterContentChecked {

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
  ){
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
    let _criteria = {
      "CountryCode": this.criteriaModel.CountryCode,
      "Fillter": this.criteriaModel.Fillter
    }
    _criteria = {...this.criteria, ..._criteria};

    // Call service provider service to get route data.
    this.serviceProviderService.post('api/Masters/GetRoute', _criteria)
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

  // Set Header or Criteria Model.
  private setHeaderOrCriteriaModel(model, type): any {
    // Set model.
    Object.keys(model).forEach((key) => {
      if (type == 'header') {
        this.headerModel[key] = model[key];;
      } else {
        this.criteriaModel[key] = model[key];
      }
    });
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
    this.setHeaderOrCriteriaModel(_headerModel, 'header');

     // Set to from page.
     this.goToFromPage();
  }

  clearModel() {
    // Clear criteriaModel.
    this.criteriaModel = {};
    Logger.info('master-vehicle', 'clearModel', this.criteria, this.isDebugMode)

    // Reload Table data.
    this.render();
  }

  addForm() {
    this.spinner.show();

    // Declare setting local header model.
    let _headerModel = {
      Operation: 'INSERT',
      Id: 'Auto',
      Code: '',
      CountryCode: '',
      Description : '',
      Active: 'Y'
    }
    // Setting header model.
    this.setHeaderOrCriteriaModel(_headerModel, 'header');
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
      "Code": this.headerModel.Code,
      "CountryCode": this.headerModel.CountryCode,
      "Description": this.headerModel.Description,
      "Active": this.headerModel.Active
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Masters/SaveRoute', criteria)
    .subscribe(data => {
      this.spinner.hide();

      let model: any = data;
      if (model.Status) {
        this.showSuccessMessage('บันทึกยกเลิกเสร็จสิ้น');
        this.backToMainPage();
      }
      else {
        this.showErrorMessage(model.Message);
      }
    }, err => {
      this.showErrorMessage(err.message);
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
      Logger.info('master-route', 'delete', result, this.isDebugMode)

      if (result) {
         this.spinner.show();

         this.headerModel.Operation = 'DELETE';
        let criteria = {
          "Operation": this.headerModel.Operation,
          "Id": param.Id ,
        }
        criteria = {...this.criteria, ...criteria};

        this.serviceProviderService.post('api/Masters/SaveRoute', criteria).subscribe(data => {
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
        this.clearModel();
      }
    });
  }

  // Choose Country for Add Form.
  chooseCountryFilter() {
    const dialogRef = this.dialog.open(CountryDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Country' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      let _criteriaModel: object = {};
      if (result != undefined) {
        _criteriaModel = {
          CountryCode: result.Code,
        }
      } else {
        _criteriaModel = {
          CountryCode: '',
        }
      }
      // Setting header model.
      this.setHeaderOrCriteriaModel(_criteriaModel, 'criteria');
    });
  }

  // Choose Country for Add Form.
  chooseCountryForm() {
    const dialogRef = this.dialog.open(CountryDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Country' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      let _headerModel: object = {};
      if (result != undefined) {
        _headerModel = {
          CountryCode: result.Code,
        }
      } else {
        _headerModel = {
          CountryCode: '',
        }
      }
      // Setting header model.
      this.setHeaderOrCriteriaModel(_headerModel, 'header');
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