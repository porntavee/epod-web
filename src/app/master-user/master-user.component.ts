import { Component, Inject, KeyValueDiffers, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import { GroupUserDialog,VehicleDialog } from '../dialog/dialog';

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
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.read();

  }

  viewModel: any;
  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "UserName": this.criteriaModel.UserName,
      "FirstName": this.criteriaModel.FirstName,
      "LastName": this.criteriaModel.LastName,
      "Mobile": this.criteriaModel.Mobile,
      "GroupCode": this.criteriaModel.GroupCode,
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      this.viewModel = model;

      if (model.Status) {
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
          this.criteriaModel.GroupCode = result.Code;
          this.criteriaModel.GroupName = result.GroupName;
        }
        else{
          this.criteriaModel.GroupCode = '';
          this.criteriaModel.GroupName = '';
        }
      });
    }

        //Group User.
        chooseGroupUserDetail() {
          //ต้องเอาไปใส่ใน app.module ที่ declarations
          const dialogRef = this.dialog.open(GroupUserDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'กลุ่มผู้ใช้งานระบบ' } });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
      
            if (result != undefined) {
              this.headerModel.GroupCode = result.Code;
              this.headerModel.GroupName = result.GroupName;
            }
            else{
              this.headerModel.GroupCode = '';
              this.headerModel.GroupName = '';
            }
          });
        }

        chooseVehicleDetail() {
          //ต้องเอาไปใส่ใน app.module ที่ declarations
          const dialogRef = this.dialog.open(VehicleDialog, { disableClose: false, height: '400px', width: '800px', data: { title: 'Vehicle' } });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
      
            if (result != undefined) {
              this.headerModel.VehicleId = result.Id;
              this.headerModel.VehicleNo = result.Description;
            }
            else{
              this.headerModel.VehicleId = '';
              this.headerModel.VehicleNo = '';
            }
          });
        }
      
    
  clear() {
    this.criteriaModel = { apptDate: '' };
  }

  add() {
    this.spinner.show();

    this.headerModel.Code = 'Auto';
    this.headerModel.FirstName = '';
    this.headerModel.LastName = '';
    this.headerModel.UserName = '';
    this.headerModel.Password = '';
    this.headerModel.LicenseNo = '';
    this.headerModel.Mobile = '';
    this.headerModel.Email = '';

    //Popup
    this.headerModel.GroupCode = '';
    this.headerModel.GroupName = '';

    this.headerModel.VehicleId = '';
    this.headerModel.VehicleNo = '';

    this.isMainPage = false;
    this.isFormPage = true;
    this.spinner.hide();
  }
  back() {
    this.isMainPage = true;
    this.isFormPage = false;
    this.isTimeSheetPage = false;
    this.read();
  }

}
