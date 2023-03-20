import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';
import { ConfirmDialog, DocReturnDialog, DriverDialog, RouteDialog, RoutingDialog, ShipToDialog, StatusDialog, TransportNoDialog, TypeOfWorkDialog, VehicleDialog } from '../dialog/dialog';

@Component({
  selector: 'app-return-transaction',
  templateUrl: './return-transaction.component.html',
  styleUrls: ['./return-transaction.component.css']
})
export class ReturnTransactionComponent implements OnInit {

  criteriaModel: any = {}; //เงื่อนไข
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  dateControl = new FormControl(moment().format('YYYYMMDD'));
  p = 1;

  listRoute: any = [];

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private differs: KeyValueDiffers,
    private excelService: ExcelService) { }

  ngOnInit(): void {

    this.read();
  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "Process": 'RETURN_TRANSACTION',
      "ReturnNo": this.criteriaModel.ReturnNo,
      "TransportNo": this.criteriaModel.TransportNo,
      "ShiptoId": this.criteriaModel.ShipToId,
      "OrderEstimate": this.criteriaModel.OrderEstimate != undefined && this.criteriaModel.OrderEstimate != "Invalid date" ? moment(this.criteriaModel.OrderEstimate).format('YYYY-MM-DD 00:00:00.000') : undefined,
      "DriverId": this.criteriaModel.DriverId,
      "VehicleId": this.criteriaModel.VehicleId,
      "RouteId": this.criteriaModel.RouteId,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Transport/GetTransportDetail', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {
          element.OrderEstimateStr = moment(element.OrderEstimate).format('DD-MM-YYYY');
          element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
          element.AdminReturnDate = moment(element.AdminReturnDate).format('DD-MM-YYYY h:mm:ss');
        });

        this.listModel = model.Data;
      }
      else {
        this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }
  setSeq(param, idx) {
    param = idx;
    return param;
  }

  chooseTransportNo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(TransportNoDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Transport No.' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.TransportNo = result.TransportNo;
      }
    });
  }

  chooseShipTo() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(ShipToDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'สถานที่รับ-ส่งสินค้า' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.ShipToId = result.Id;
        this.criteriaModel.ShipToCode = result.Code;
        this.criteriaModel.ShipToAddress = result.Address;
        this.criteriaModel.ShipToDescription = result.Code + ' - ' + result.CustomerName;
      }
    });
  }

  chooseVehicle() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'ทะเบียนรถ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.VehicleId = result.Id;
        this.criteriaModel.VehicleNo = result.Code;
        this.criteriaModel.VehicleDescription = result.Code + ' - ' + result.Description;
      }
    });
  }

  chooseDriver() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DriverDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'คนขับ' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.DriverId = result.Id;
        this.criteriaModel.DriverCode = result.Code;
        this.criteriaModel.DriverDescription = result.Code + ' - ' + result.FirstName + ' ' + result.LastName;
      }
    });
  }

  chooseRoute() {
    const dialogRef = this.dialog.open(RoutingDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เส้นทางหลัก' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.RouteId = result.Id;
        this.criteriaModel.RouteCode = result.Code;
        this.criteriaModel.RouteDescription = result.Code + ' - ' + result.Description;
      }
    });
  }
  chooseDocReturn() {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(DocReturnDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'เลขที่คืนเอกสาร' } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {
        this.criteriaModel.ReturnNo = result.ReturnNo;
      }
      else {
        this.criteriaModel.ReturnNo = '';
      }
    });
  }

  clear() {
    this.criteriaModel = { OrderEstimate: '' };
  }

  delete(idx) {
    const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: false, height: '150px', width: '300px', data: { title: 'คุณต้องการลบรายการนี้ ใช่หรือไม่ ?' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.spinner.show();
        let criteria = {
          "userinformation": this.serviceProviderService.userinformation,
          "Process": 'CANCEL_RETURN',
          "TransportNo": this.listModel[idx].TransportNo,
          "OrderNo": this.listModel[idx].OrderNo,
        }

        let json = JSON.stringify(criteria);

        this.serviceProviderService.post('api/Transport/ReturnOrders', criteria).subscribe(data => {
          this.spinner.hide();
          let model: any = {};
          model = data;
          if (model.Status) {
            this.listModel.splice(idx, 1);
            this.spinner.hide();
            this.toastr.success('บันทึกยกเลิกเสร็จสิ้น', 'แจ้งเตือนระบบ', { timeOut: 5000 });
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
    });
  }

  statusOrderColor(param) {
    switch (param) {
      case 'C':
        return '#E16E5B'
      case 'D':
        return '#F7E884'
      case 'L':
        return '#F7E884'
      case 'O':
        return '#B6B6B6'
      case 'P':
        return '#79D58B'
      case 'R':
        return '#79D58B'
      case 'S':
        return '#66A5D9'
      case 'W':
        return '#B6B6B6'
      case 'F':
        return '#EBB146'
      default:
        break;
    }

  }

  exModel: any = [{
    title: 'hello world'
  }, {
    title: 'hello world'
  }, {
    title: 'hello world'
  }];

  readTransport(param) {

    if (this.criteriaModel.InvoiceNo == '' && this.criteriaModel.TransportNo == '') {
      this.toastr.error('กรุณาระบุเงื่อนไขเอกสาร', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      return;
    }

    this.spinner.show();

    this.criteriaModel.userinformation = this.serviceProviderService.userinformation;
    this.criteriaModel.Process = 'ADMIN_RETRURN';

    this.serviceProviderService.post('api/Transport/GetTransportDetail', this.criteriaModel).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        model.Data.forEach(element => {

          let dup = this.listModel.filter(c => c.InvoiceNo == element.InvoiceNo);

          if (dup.length == 0) {
            element.OrderEstimate = moment(element.TransportDate).format('DD-MM-YYYY');
            element.InvoiceDateStr = moment(element.InvoiceDate).format('DD-MM-YYYY');
            this.listModel.push(element);
          }

        });


        this.criteriaModel.InvoiceNo = '';
        this.criteriaModel.TransportNo = '';
      }
      else {
        // this.listModel = [];
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

  }
}
