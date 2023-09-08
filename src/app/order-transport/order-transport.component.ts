import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, KeyValueDiffers, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog, DriverDialog, PrintTransportDialog, ShipToDialog, StatusDialog, TransportNoDialog, TypeOfWorkDialog, VehicleDialog } from '../dialog/dialog';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';

@Component({
  selector: 'app-order-transport',
  templateUrl: './order-transport.component.html',
  styleUrls: ['./order-transport.component.css']
})
export class OrderTransportComponent implements OnInit, AfterContentChecked {

  listModel: any = []; //ข้อมูลในตารางหน้า Main
  criteriaModel: any = {} //ค้นหา
  title: string = 'เพิ่มข้อมูล';
  dateControl = new FormControl(moment().format('YYYYMMDD'));

  mode: any = 'create';
  p = 1;



  constructor(public dialog: MatDialog,
    private router: Router,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService,
    public changeDetector: ChangeDetectorRef) {
      this.criteria =  {
        "userinformation": this.serviceProviderService.userinformation 
      }
     }

  ngOnInit(): void {
    const date = new Date();
    this.criteriaModel.TransportDate = moment(date.setDate(date.getDate())).format('YYYYMMDD');

    this.read();


  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "TransportNo": this.criteriaModel.transportNo,
      "ReceiveFromCode": this.criteriaModel.shipToCode,
      "ApproveDate": this.verifyDateTime(this.criteriaModel.approveDateString),
      "DriverId": this.criteriaModel.driverId,
      "TransportStatus": this.criteriaModel.statusCode,
      "TransportTypeId": this.criteriaModel.typeOfWorkCode,
      "VehicleId": this.criteriaModel.vehicleId,
      "TransportDate": this.verifyDateTime(this.criteriaModel.TransportDate)
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetTransportHeader', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {
          element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
        });

        this.listModel = model.Data;
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

  verifySring(str): string {
    return str != undefined ? str : '';
  }

  verifyDateTime(date: string, from: string = ''): any {
    let dateObj: any = date == "Invalid date" || date == undefined ? undefined : moment(date).format('YYYY-MM-DD 00:00:00.000');

    return dateObj;
  }

  criteria: object = {}; // User Information.

  printAlert(param) {

    debugger
    let criteria = {
      "TransportNo": param.TransportNo
    }
    criteria = {...this.criteria, ...criteria};

    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
        this.spinner.hide();

        let model: any = data;
        this.viewModel = model;
        if (model.Status) {

          debugger
          param.items = model.Data
          // this.listModel = model.Data;

          // model.Data.forEach(element => {
          //   element.OrderEstimateStr = this.verifyDate(element.OrderEstimate);
          //   element.InvoiceDateStr = this.verifyDate(element.InvoiceDate);
          // });

          const dialogRef = this.dialog.open(PrintTransportDialog, { disableClose: false, height: '160px', width: '300px', data: param });
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if (result) {
              // this.confirm();
            }
            else {
              return;
            }
          });
        } else {
          this.spinner.hide();
          // this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        }

      }, err => {
        this.spinner.hide();
        this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      });


    // if (this.criteriaModel.ReturnNo == '') {

    // }
    // else {
    //   // this.confirm();
    // }
  }

  verifyDate(date: any): any {
    let dateObj: any = (date === "Invalid date" || date == undefined) ? undefined : moment(date).format('DD-MM-YYYY');
    // console.log((date === "Invalid date"), dateObj, from);
    return dateObj;
  }

  //use
  chooseStatus() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(StatusDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานะเอกสาร' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.statusCode = result.Code;
        this.criteriaModel.statusDescription = result.Code + ' - ' + result.Description;
      } else {
        this.criteriaModel.statusCode = '';
        this.criteriaModel.statusDescription = '';
      }
    });
  }

  //use
  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Ship to' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.shipToCode = result.Code;
        this.criteriaModel.shipToAddress = result.Address;
        this.criteriaModel.shipToDescription = result.Code + ' - ' + result.CustomerName
      }
    });
  }

  //use
  chooseTypeOfWork() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TypeOfWorkDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Type of Work' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        // this.criteriaModel.transportTypeId = result.Id;
        this.criteriaModel.typeOfWorkCode = result.Code;
        this.criteriaModel.typeOfWorkDescription = result.Code + ' - ' + result.Description;
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
        this.criteriaModel.transportNo = result.TransportNo;
      }
    });
  }

  //use
  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'คนขับ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.driverId = result.Id;
        this.criteriaModel.driverCode = result.Code;
        this.criteriaModel.driverDescription = result.Code + ' - ' + result.FirstName + ' ' + result.LastName;
      }
    });
  }

  //use
  chooseVehicle() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ทะเบียนรถ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.vehicleId = result.Id;
        this.criteriaModel.vehicleCode = result.Code;
        this.criteriaModel.vehicleDescription = result.Code + ' - ' + result.Description;
      }
    });
  }

  clear() {
    this.criteriaModel = {
      approveDateString: this.verifyDateTime(''),
      TransportDate: this.verifyDateTime('')
    };
  }

  reportModel: any = [];
  exportAsXLSX(param): void {

    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "DocNum": param.DocNum
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('/api/B1/getTimeSheetLog', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {
        // this.toastr.success('บันทึกสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        this.reportModel = model.Data

      } else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });


  }

  exportAsXLSX2(): void {
    // this.spinner.show();

    // let code = 'AC001';
    // let zdocNum = 'AC002';
    // let firstName = 'ลลิตา';
    // let dateFrom = '01/06/2022';
    // let lastName = 'ลลิตา';
    // let dateTo = '01/06/2022';


    // let excelModel = [];
    // excelModel.push(
    //   { 'Code': 'First Name', [this.model.Code]: this.model.FirstName, ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': 'Date From', [' ' + this.model.DocNum]: moment(this.model.DateFrom).format('DD-MM-YYYY'), '        ': '', '         ': '' },
    //   { 'Code': 'Last Name', [this.model.Code]: this.model.LastName, ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': 'Date To', [' ' + this.model.DocNum]: moment(this.model.DateTo).format('DD-MM-YYYY'), '        ': '', '         ': '' },
    //   { 'Code': '', [this.model.Code]: '', ' ': '', '  ': '', '   ': '', '    ': '', '     ': '', '      ': '', '       ': '', 'Doc Num': '', [' ' + this.model.DocNum]: '', '        ': '', '         ': '' },
    //   { 'Code': 'Date', [this.model.Code]: 'Start Time', ' ': 'Hour', '  ': 'End Time', '   ': 'Activity Type', '    ': 'Financial Project', '     ': 'Cost Center', '      ': 'Stage', '       ': 'Break', 'Doc Num': 'Nonbillable Time', [' ' + this.model.DocNum]: 'Effective Time', '        ': 'Billable Time', '         ': 'Detail' });


    // this.models.forEach(element => {
    //   excelModel.push(
    //     { 'Code': element.Date, [this.model.Code]: element.StartTimeText, ' ': element.U_HMC_Hour, '  ': element.EndTimeText, '   ': element.ActType, '    ': element.FiProject, '     ': element.CostCenter, '      ': element.U_HMC_Stage, '       ': element.BreakText, 'Doc Num': element.NonBillTmText, [' ' + this.model.DocNum]: element.EffectTmText, '        ': element.BillableTmText, '         ': element.U_HMC_Detail }
    //   );
    // });
    // this.excelService.exportAsExcelFile(excelModel, 'timesheet-report');
    // // this.excelService.exportAsExcelFile(this.listModel, 'user-log-report');
    // this.spinner.hide();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listModel, event.previousIndex, event.currentIndex);
  }

  delete(param) {

    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: false, height: '150px', width: '300px', data: { title: 'คุณต้องลบใช่หรือไม่?' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.criteriaModel = {};

        // console.log(this.criteriaModel);

        this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
        this.criteriaModel.Process = 'DELETE';
        this.criteriaModel.TransportNo = param;

        // console.log(this.criteriaModel);

        this.serviceProviderService.post('api/Transport/CancelTransport', this.criteriaModel).subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          this.viewModel = model;


          if (model.Status) {
            this.criteriaModel.TransportNo = model.Data;
            this.toastr.success("ลบใบคุมเสร็จสิ้น", 'แจ้งเตือนระบบ', { timeOut: 5000 });
            this.read();
          }

        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });

  }

  // Classify status color.
  statusTransportClassify(param) {
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
      case 'M':
        return 'status-color-M'
      default:
        break;
    }
  }

  create() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`order-transport-form/new`])
      // this.router.createUrlTree([`order-transport-form/new`])
    );

    window.open(url, '_blank');
  }

  edit(param) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`order-transport-form/` + param])
      // this.router.createUrlTree([`order-transport-form/` + param])
    );

    window.open(url, '_blank');
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
