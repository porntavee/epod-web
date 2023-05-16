import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TransportNoDialog, ShipToDialog, StatusDialog, JobStatusDialog, JobOrderStatusDialog, TypeOfWorkDialog,
  RoutingDialog, RouteDialog, SubRoutingDialog, VehicleDialog, DriverDialog, ConfirmDialog, UploadOrderDialog,
  LocationAddressDataDialog, MasterDataDialog } from '../dialog/dialog';
import { ServiceProviderService } from '../shared/service-provider.service';
import { Logger } from '../shared/logger.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, AfterContentChecked {

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
  listDetailModel : any     = [];
  viewModel       : any     = {};
  currentPage     : number  = 1;
  listRoute       : any     = [];
  listTransport   : any     = [];
  id              : any     = '';

  constructor(
    public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public changeDetector: ChangeDetectorRef
  ) {
    // Initialize userinformation to criteria object.
    this.criteria = { 
      "userinformation": this.serviceProviderService.userinformation
    };
  }

  ngOnInit(): void {
    this.criteriaModel.StatusCode = 'O';
    this.criteriaModel.StatusDescription = 'O - รอจัดใบคุมรถ';

    this.render();
    this.readRoute();
    this.readTransport();
  }

  render(task='') {
    // Show spinner.
    this.spinner.show();
    
    this.currentPage = 1;
    // Set Operations in Header Model.
    this.headerModel.Operation = 'SELECT';
    // Set criteriaModel to criteria For Filter.
    let _criteria = {
      OrderNo: this.criteriaModel.OrderNo,
      ShiptoId: this.criteriaModel.ShiptoId,
      InvoiceNo: this.criteriaModel.InvoiceNo,
      OrderDateStart: this.verifyDateTime(this.criteriaModel.OrderDateStart),
      OrderDateEnd: this.verifyDateTime(this.criteriaModel.OrderDateEnd),
      OrderStatus: this.criteriaModel.StatusCode,
      InvoiceDate: this.verifyDateTime(this.criteriaModel.InvoiceDate),
      TransportId: this.criteriaModel.TransportId,
      TransportOrderStatus: this.criteriaModel.TransportOrderStatus,
    }
    _criteria = {...this.criteria, ..._criteria};

    console.log('render', _criteria);

    // Check empty search.
    if (task == 'search') {
      let filterNone: any = []
      for (const [key, value] of Object.entries(_criteria)) {
        if (key != 'userinformation') {
          filterNone.push(value == undefined || value == '');
        }
      }

      if (!filterNone.includes(false)) {
        this.showErrorMessage('กรุณาระบุเงื่อนไขค้นหา');
        return;
      }
    }

    this.serviceProviderService.post('api/Transport/GetOrder', _criteria).subscribe(data => {
      // Logger.info('master-order', 'render', _criteria, this.isDebugMode)
      this.spinner.hide();

      let model: any = data;
      this.viewModel = model;
      if (model.Status) {
        
        model.Data.forEach(element => {
          Object.keys(element).forEach((key) => {
            if (key.includes('InvoiceDate') || key.includes('OrderDate') || key.includes('OrderEstimate')) {
              element[key + 'Str'] = (element[key] == "Invalid date" || element[key] == undefined) ?
                undefined : moment(element[key]).format('DD-MM-YYYY');
            }
          });
        });

        // Check model status if true set model data to list model.
        this.listModel = model.Data
      } else {
        this.listModel = this.loadDataFalse(model.Message);
      }
    }, err => {
      this.showErrorMessage(err.message);
    }); 
  }

  verifyDateTime(date: any): any {
    let dateObj: any = date == "Invalid date" || date == undefined ? undefined : moment(date).format('YYYY-MM-DD 00:00:00.000');

    return dateObj;
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
    Object.keys(model).forEach((key) => {
        if (type == 'header') {
          this.headerModel[key] = model[key];
        } else {
          this.criteriaModel[key] = model[key];
        }
    });
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
    this.criteriaModel.StatusCode = 'O';
    this.criteriaModel.StatusDescription = 'O - รอจัดใบคุมรถ';
    
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listDetailModel, event.previousIndex, event.currentIndex);
  }

  // Clear Model.
  clearModel() {
    const date = new Date();

    // Clear criteriaModel.
    this.criteriaModel = {
      OrderDateStart: this.verifyDateTime(''),
      OrderDateEnd: this.verifyDateTime(''),
      InvoiceDate: this.verifyDateTime('')
    };
  }

  // Set form for update.
  setForm(param) {
    // Show spinner.
    this.spinner.show();
    // Set to Form Page.
    this.headerModel = param;
    // Set Operation to UPDATE
    let _headerModel = {
      Process:"UPDATE",
      OrderNo:param.OrderNo,
      OrderTypeId:param.OrderTypeId,
      OrderTypeDescription: param.OrderTypeCode + ' - ' + param.OrderType,
      OwnerId:param.OwnerId,
      OwnerDescription:param.OwnerCode + ' - ' + param.OwnerName,
      ShiptoId:param.ShiptoId,
      ShiptoCode:param.ShiptoCode,
      ShiptoAddress:param.Address,
      ShiptoDescription:param.ShiptoCode + ' - ' + param.ShiptoName,
      ShiptoMobile:param.Mobile,
      RouteId:param.RouteId,
      SubRouteId:param.SubRouteId,
      RouteDescription: param.Route,
      SubRouteDescription:param.SubRoute,
      TransportDescription:param.TransportCode    + ' - ' + param.Transport,
      OrderDate:this.verifyDateTime(this.headerModel.OrderDate),
      OrderEstimate:this.verifyDateTime(this.headerModel.OrderEstimate),
      InvoiceDate:this.verifyDateTime(this.headerModel.InvoiceDate),
      Qty:param.Qty == 0 ? '0' : param.Qty,
      CBM:param.CBM == 0 ? '0' : param.CBM,
      Weight:param.Weight == 0 ? '0' : param.Weight,
    }

    // Setting header model.
    this.setHeaderOrCriteriaModel(_headerModel, 'header');

    // Set to from page.
    this.goToFromPage();
  }

  // Set form for add.
  addForm() {
    // Show spinner.
    this.spinner.show();

    const date = new Date();

    // Declare setting local header model.
    let _headerModel = {
      Process: 'CREATE',
      Id: 'Auto',
      OrderNo:'',
      InvoiceNo:'',
      Comment:'',
      ReferenceNo:'',
      OrderTypeDescription: '',
      PurchaseNo:'',
      Qty:'',
      OwnerDescription: '',
      UoM:'N/A',
      CBM:'',
      ShiptoMobile: '',
      Weight:'',
      ShiptoAddress: '',
      ShiptoDescription: '',
      RouteDescription: '',
      SubRouteDescription: '',
      TransportId: '',
      TransportDescription: '',
      OrderDate: this.verifyDateTime(date),
      InvoiceDate: this.verifyDateTime(date),
      OrderEstimate: this.verifyDateTime(date.setDate(date.getDate() + 1)),
      Task: 'new'
    }

    // Setting header model.
    this.headerModel = {};
    this.setHeaderOrCriteriaModel(_headerModel, 'header');

    // Set to from page.
    this.goToFromPage();
  }

  private setModel(model) {
    // Set model.
    let _model: any = model;
    for (const key in model) {
      _model[key] = model[key];
    }

    return _model;
  }

  // If error load data.
  private ShowError(message: string) {
    this.spinner.hide();
    this.toastr.error(message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
  }

  readTransport() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Code": ""
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/Masters/GetTransport', criteria).subscribe(data => {
      // Set data to model.
      let model: any = data;
      this.viewModel = model;
      // Check model status if true set model data to list model.
      this.listTransport = model.Status ? model.Data : this.loadDataFalse(model.Message);
    }, err => {
      this.showErrorMessage(err.message);
    });
  }

  chooseTransport() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Transport',
        listData: this.listTransport,
        listDataSearch: this.listTransport 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // Declare setting local criteria model.
        let _headerModel = {
          'TransportId'          : result.Id,
          'TransportCode'        : result.Code,
          'TransportDescription' : result.Code + ' - ' + result.Description
        }
        // Setting header model.
        _headerModel = this.setModel(_headerModel);
        this.headerModel = {...this.headerModel, ..._headerModel};
      }
    });
  }

  chooseTransportFilter() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(RouteDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Transport',
        listData: this.listTransport,
        listDataSearch: this.listTransport 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // Declare setting local criteria model.
        let _criteriaModel = {
          'TransportId'          : result.Id,
          'TransportCode'        : result.Code,
          'TransportDescription' : result.Code + ' - ' + result.Description
        }
        // Setting header model.
        _criteriaModel = this.setModel(_criteriaModel);
        this.criteriaModel = {...this.criteriaModel, ..._criteriaModel};
      }
    });
  }

  //use
  chooseStatusFilter() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(JobStatusDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'สถานะบิล' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('chooseStatusFilter', result);
      if (result != undefined) {
        this.criteriaModel.StatusCode = result.Code;
        this.criteriaModel.StatusDescription = result.Code + ' - ' + result.Description;
      } else {
        this.criteriaModel.StatusCode = '';
        this.criteriaModel.StatusDescription = '';
      }
    });
  }

  chooseJobOrderStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(JobOrderStatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานะ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        console.log('chooseJobOrderStatus', result);
        // this.criteriaModel.OrderStatus = result.Id;
        this.criteriaModel.TransportOrderStatus = result.Code;
        this.criteriaModel.TransportOrderStatusDesc = result.Code + ' - ' + result.Description;
        // param.Code = result.Code;
        // param.FirstName = result.firstName;
        // param.LastName = result.lastName;
        // param.UserID = result.empID;
        // this.costCenter = result.CostCenter;
      }
    });
  }

  chooseTransportStatusFilter() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(StatusDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'สถานะขนส่ง' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportOrderStatus = result.Code;
        this.criteriaModel.TransportOrderStatusDesc = result.Code + ' - ' + result.Description;
      }
    });
  }

  //use
  chooseTransportNo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TransportNoDialog, {
      disableClose: false,
      height: '400px',
      width: '800px', 
      data: { title: 'Transport No.' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.transportNo = result.TransportNo;
      }
    });
  }

  //use
  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Ship to' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.ShiptoId = result.Id;
        this.headerModel.ShiptoCode = result.Code;
        this.headerModel.ShiptoAddress = result.Address;
        this.headerModel.ShiptoDescription = result.Code + ' - ' + result.CustomerName;
        this.headerModel.ShiptoMobile = result.Mobile;
        this.headerModel.RouteDescription = result.Route;
        this.headerModel.SubRouteDescription = result.SubRoute;
      } else { 
        this.headerModel.ShiptoId = '';
        this.headerModel.ShiptoCode = '';
        this.headerModel.ShiptoAddress = '';
        this.headerModel.ShiptoDescription = '';
        this.headerModel.ShiptoMobile = '';
        this.headerModel.RouteDescription = '';
        this.headerModel.SubRouteDescription = '';
      }
    });
  }

  //use
  chooseOwner() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(LocationAddressDataDialog, { 
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'เจ้าของงาน' ,  urlapi:'api/Masters/GetOwner'} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.OwnerId = result.Id;
        this.headerModel.OwnerDescription = result.Code + ' - ' + result.Description;
      } else {
        this.headerModel.OwnerId = '';
        this.headerModel.OwnerDescription = '';
      }
    });
  }

  //use
  chooseStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(StatusDialog, {
      disableClose: false,
      height: '400px',
      width: '800px', 
      data: { title: 'Status' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.headerModel.transportTypeId = result.Id;
        this.headerModel.StatusCode = result.Code;
        this.headerModel.StatusDescription = result.Code + ' - ' + result.Description;
      } else {
        this.headerModel.StatusCode = '';
        this.headerModel.StatusDescription = '';
      }
    });
  }

  chooseJobType() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(MasterDataDialog, {
      disableClose: false,
      height: '400px',
      width: '800px', 
      data: { title: 'ประเภทเอกสาร' , urlapi:'api/Masters/GetJobType' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.OrderTypeId = result.Code;
        this.headerModel.OrderTypeDescription = result.Code + ' - ' + result.Description;
      }
    });
  }
  
  //use
  chooseTypeOfWork() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TypeOfWorkDialog, { 
      disableClose: false, 
      height: '400px', 
      width: '800px', 
      data: { title: 'Type of Work' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.OrderTypeId = result.Code;
        this.headerModel.OrderTypeDescription = result.Code + ' - ' + result.Description;
      } else {
        this.headerModel.OrderTypeId = '';
        this.headerModel.OrderTypeDescription = '';
      }
    });
  }

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางหลัก' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      this.headerModel.SubRouteId = '';
      this.headerModel.SubRouteCode = '';
      this.headerModel.SubRouteDescription = '';

      if (result != undefined) {
        this.headerModel.RouteId = result.Id;
        this.headerModel.RouteCode = result.Code;
        this.headerModel.RouteDescription = result.Description;
      } else {
        this.headerModel.RouteId = '';
        this.headerModel.RouteCode = '';
        this.headerModel.RouteDescription = '';
      }
    });
  }

  chooseSubRoute() {
    if(this.headerModel.RouteId == '' || this.headerModel.RouteId == undefined){
      this.toastr.error('กรุณาระบุเส้นทางหลัก', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    const dialogRef = this.dialog.open(SubRoutingDialog, { 
      disableClose: false, 
      height: '400px',
      width: '800px',
      data: { title: 'เส้นทางย่อย' ,RouteId : this.headerModel.RouteId} });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.SubRouteId = result.Id;
        this.headerModel.SubRouteCode = result.Code;
        this.headerModel.SubRouteDescription = result.Description;
      } else {
        this.headerModel.SubRouteId = '';
        this.headerModel.SubRouteCode = '';
        this.headerModel.SubRouteDescription = '';
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
      data: { title: 'Vehicle' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.VehicleId = result.Id;
        this.headerModel.VehicleCode = result.Code;
        this.headerModel.VehicleDescription = result.Code + ' - ' + result.Description;
      } else {
        this.headerModel.VehicleId = '';
        this.headerModel.VehicleCode = '';
        this.headerModel.VehicleDescription = '';
      }
    });
  }

  //use
  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Driver' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.headerModel.DriverId = result.Id;
        this.headerModel.DriverCode = result.Code;
        this.headerModel.DriverDescription = result.Code + ' - ' + result.FirstName + ' ' + result.LastName;
      } else {
        this.headerModel.DriverId = '';
        this.headerModel.DriverCode = '';
        this.headerModel.DriverDescription = '';
      }
    });
  }

  //use
  readRoute() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
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
  chooseShipToFilter() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, {
      disableClose: false,
      height: '400px',
      width: '800px',
      data: { title: 'Ship to' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('chooseShipToFilter', result);
      if (result != undefined) {
        
        this.criteriaModel.ShiptoId = result.Id;
        this.criteriaModel.ShiptoCode = result.Code;
        this.criteriaModel.ShiptoName = result.CustomerName;
        this.criteriaModel.ShiptoAddress = result.Address;
        this.criteriaModel.ShiptoDescription = result.Code + ' - ' + result.CustomerName;
        this.criteriaModel.ShiptoMobile = result.Mobile;
        this.criteriaModel.RouteDescription = result.Route;
        this.criteriaModel.SubRouteDescription = result.SubRoute;
      } else {
        this.criteriaModel.ShiptoId = '';
        this.criteriaModel.ShiptoCode = '';
        this.criteriaModel.ShiptoName = '';
        this.criteriaModel.ShiptoAddress = '';
        this.criteriaModel.ShipToDescription = '';
        this.criteriaModel.ShiptoMobile = '';
        this.criteriaModel.RouteDescription = '';
        this.criteriaModel.SubRouteDescription = '';
      }
    });
  }

  // Save data.
  save() {
    this.spinner.show();
    
    this.headerModel.Qty = this.headerModel.Qty == '' ? '0' : this.headerModel.Qty;
    this.headerModel.CBM = this.headerModel.CBM == '' ? '0' : this.headerModel.CBM;
    this.headerModel.Weight = this.headerModel.Weight == '' ? '0' : this.headerModel.Weight;
    this.headerModel.OrderDate = this.verifyDateTime(this.headerModel.OrderDate),
    this.headerModel.OrderEstimate = this.verifyDateTime(this.headerModel.OrderEstimate),
    this.headerModel.InvoiceDate = this.verifyDateTime(this.headerModel.InvoiceDate),
    // this.headerModel.UoM = this.headerModel.UoM;
    this.headerModel = {...this.criteria, ...this.headerModel};


    this.serviceProviderService.post('api/Transport/CreateOrder', this.headerModel)
    .subscribe(data => {
      this.spinner.hide();
      let model: any = data;
      if (model.Status) {
        this.criteriaModel.OrderNo = this.headerModel.Task == 'new' ? model.Data : this.headerModel.OrderNo;
        Logger.info('master-shiplocation', 'save-this.criteriaModel', this.criteriaModel, this.isDebugMode)
        // Clear criteriaModel.
        this.criteriaModel.OrderDateStart = undefined;
        this.criteriaModel.OrderDateEnd = undefined;

        this.showSuccessMessage('บันทึกยกเลิกเสร็จสิ้น');
      } else {
        this.showErrorMessage(model.Message);
      }
    }, err => {
      this.showErrorMessage(err.message);
    });
    // Clear criteriaModel and Reload Table Data.
    this.clearModel();
  }

  backToMain() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.render();
  }

  delete(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, {
      disableClose: false, 
      height: '150px', 
      width: '300px', 
      data: { title: 'คุณต้องลบรายการใช่หรือไม่?' } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {

        let criteria: any = {};
        criteria.userinformation = this.serviceProviderService.userinformation;
        criteria.Process = 'DELETE';
        criteria.OrderNo = param.OrderNo;

        this.serviceProviderService.post('api/Transport/CreateOrder', criteria).subscribe(data => {
          this.spinner.hide();

          let model: any = data;
          this.viewModel = model;
          if (model.Status) {
            this.criteriaModel.TransportNo = model.Data;
            this.toastr.success("ลบรายการเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.render();
          }
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });
  }

  statusOrderClassify(param) {
    switch (param) {
      case 'C':
        return 'status-color-C'
      case 'D':
        return 'status-color-D'
      case 'L': 
        return 'status-color-L'
      case 'O':
        return 'status-color-O'
      case 'P':
        return 'status-color-P'
      case 'R':
        return 'status-color-R'
      case 'S':
        return 'status-color-S'
      case 'W':
        return 'status-color-W'
      case 'F':
        return 'status-color-F'
        case 'H':
          return 'status-color-H'
      default:
        break;
    }
  }

  statusTransportColorClassiyf(param) {
    switch (param) {
      case 'C':
        return 'status-color-C'
      case 'D':
        return 'status-color-D'
      case 'L': 
        return 'status-color-L'
      case 'O':
        return 'status-color-O'
      case 'P':
        return 'status-color-P'
      case 'R':
        return 'status-color-R'
      case 'S':
        return 'status-color-S'
      case 'W':
        return 'status-color-W'
      case 'F':
        return 'status-color-F'
      default:
        break;
    }
  }

  upload() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(UploadOrderDialog, { 
      disableClose: false, 
      height: '700px', 
      width: '1200px', 
      data: { title: 'คุณต้องลบรายการใช่หรือไม่?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (!result) {
        return;
      } else {

        this.spinner.show();

        this.criteriaModel.userinformation = this.serviceProviderService.userinformation;

        let model: any = [];
        result.forEach(element => {
          const [day, month, year] = element.IssueDate.split('/');
          const date = new Date(+year, +month - 1, +day);

          model.push({
            "OrderDateStart": moment(date).format('YYYY-MM-DDT00:00:00'),
            "OrderDateEnd": moment(date.setDate(date.getDate() + 1)).format('YYYY-MM-DDT00:00:00'),
            "InvoiceNo": element.InvoiceNo,
            "Comment": element.Remark,
            "ReferenceNo": element.ReferenceNo,
            "OrderTypeDescription": "",
            "PurchaseNo": element.PONo,
            "CBM": element.CBM,
            "OwnerDescription": "",
            "Qty": element.Carton,
            "UOM":"N/A",
            "ShiptoDescription": "",
            "Weight": element.Weight,
            "ShiptoAddress": "",
            "OwnerCode": element.SenderCode,
            "RouteCode": element.Route,
            "SubRouteCode": element.SubRoute,
            "OrderTypeId": element.TypeOfWork,
            "ShiptoId": "",
            "ShiptoCode": element.RecipientCode,
            "ShiptoMobile": "",
          })
        });

        this.criteriaModel.TTRANSPORTDLIST = model;

        let json = JSON.stringify(this.criteriaModel);

        this.serviceProviderService.post('api/Transport/CreateOrderImport', this.criteriaModel).subscribe(data => {
          debugger
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;

          if (model.Status) {
            this.criteriaModel.OrderNo = model.Data;
            this.toastr.success("บันทึกข้อมูลเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
          } else {
            // this.listModel = [];
            this.spinner.hide();
            this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          }
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });
  }

  // Fixing "Expression has changed after it was checked"
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}
