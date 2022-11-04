import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceProviderService } from './../shared/service-provider.service';
import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffer, KeyValueDiffers, KeyValueChanges, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { ExcelService } from '../shared/excel.service';
import { EmployeeDialog } from '../news/news.component';

@Component({
  selector: 'app-user-log-report',
  templateUrl: './user-log-report.component.html',
  styleUrls: ['./user-log-report.component.css']
})
export class UserLogReportComponent implements OnInit {

  criteriaModel: any = {} //ค้นหา
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  p = 1;

  constructor(public dialog: MatDialog,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.readEmployee();
    this.read();
  }

  readEmployee() {
    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
    }

    // let json = JSON.stringify(criteria);
    this.serviceProviderService.post('api/B1/GetEmployeeTimeSheet', criteria).subscribe(data => {
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
        this.listEmployee = model.Data;
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

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "CodeFrom": this.criteriaModel.CodeFrom,
      "CodeTo": this.criteriaModel.CodeTo,
      "TimeStampFrom": this.criteriaModel.TimeStampFrom == "Invalid date" ? '' : moment(this.criteriaModel.TimeStampFrom).format('YYYY-MM-DD'),
      "TimeStampTo": this.criteriaModel.TimeStampTo == "Invalid date" ? '' : moment(this.criteriaModel.TimeStampTo).format('YYYY-MM-DD')
    }

    let json = JSON.stringify(criteria);
  
    this.serviceProviderService.post('api/B1/getUserLog', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
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

  listEmployee: any = [];
  
  chooseEmployee(param) {
    //ต้องเอาไปใส่ใน app.module ที่ declarations
    const dialogRef = this.dialog.open(EmployeeDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Employee', listData: this.listEmployee, listDataSearch: this.listEmployee } });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result != undefined) {

        if (param == 'from')
          this.criteriaModel.CodeFrom = result.Code;
        else
          this.criteriaModel.CodeTo = result.Code;

      }
    });
 }

  exportAsXLSX(): void {

    this.spinner.show();
    this.excelService.exportAsExcelFile(this.listModel, 'user-log-report');
    this.spinner.hide();

    // this.listModel.forEach((e, index) => {


    //   result.push({
    //     'ลำดับ': index + 1,
    //     'หัวข้อ': e.title,
    //     'หมวดหมู่': e.category,
    //     'สร้างโดย': e.createBy,
    //     'สร้างวันที่': DatetimeFormatPipe.transform(e.createDate),
    //     'อัพเดทโดย': e.updateBy,
    //     'อัพเดทวันที่': DatetimeFormatPipe.transform(e.updateDate),
    //     'สถานะ': status,
    //     'center': e.center,
    //   })
    // });

    // this.excelService.exportAsExcelFile(this.listModel, 'รายงานข่าวประชาสัมพันธ์');
    // this.spinner.hide();
  }

}
