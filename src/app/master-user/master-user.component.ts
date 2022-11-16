import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { GroupUserDialog } from '../dialog/dialog';

@Component({
  selector: 'app-master-user',
  templateUrl: './master-user.component.html',
  styleUrls: ['./master-user.component.css']
})
export class MasterUserComponent implements OnInit {

  isMainPage: boolean = true;
  isFormPage: boolean = false;
  isTimeSheetPage: boolean = false;
  listModel: any = []; //ข้อมูลในตารางหน้า Main
  listDetailModel: any = [];
  headerModel: any = {};
  criteriaModel: any = {} //ค้นหา
  title: string = 'เพิ่มข้อมูล';
  model: any = {}; //ข้อมูล Form
  models: any = []; //ข้อมูลในตารางหน้า Form
  timeSheetModel: any = {};
  dateControl = new FormControl(moment().format('YYYYMMDD'));

  mode: any = 'create';

  p = 1;

  listGroupUser: any = [];

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

    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {

        // model.Data.forEach(element => {
        //   element.TransportDate = moment(element.TransportDate).format('DD-MM-YYYY');
        // });

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

    //Group User.
    chooseGroupUser() {
      //ต้องเอาไปใส่ใน app.module ที่ declarations
      const dialogRef = this.dialog.open(GroupUserDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'กลุ่มผู้ใช้งานระบบ' } });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
  
        if (result != undefined) {
          this.criteriaModel.Code = result.Code;
          this.criteriaModel.GroupName = result.GroupName;
        }
        else{
          this.criteriaModel.Code = '';
          this.criteriaModel.GroupName = '';
        }
      });
    }
    
  clear() {
    this.criteriaModel = { apptDate: '' };
  }


}
