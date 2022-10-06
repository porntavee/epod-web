import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  @Input() messageInput: any = [];
  @Input() messageTagsAndRegions: any = [];
  @Output() messageToEmit = new EventEmitter<any>();
  @Output() typeMessage = new EventEmitter<any>();
  @Input() paginationModel: any = {}; // <----- Pagination
  category: any = {};
  permission: any;
  chkall: boolean = false;
  itemSelectedList: any = [];
  itemSelected: boolean = false;
  searchModel: any = {};

  username: string = '';
  isUsername: boolean = false;
  

  constructor(private router: Router, private serviceProviderService: ServiceProviderService, public dialog: MatDialog, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.username = localStorage.getItem('username');
    if (this.username == 'admincms' || this.username == 'adminnick' || this.username == 'adminpee' || this.username == 'adminmay' || this.username == 'admintoon')
      this.isUsername = true;

    if (localStorage.getItem('category') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
    }

    if (localStorage.getItem('newsPage') != null) {
      this.permission = JSON.parse(localStorage.getItem('newsPage'));
    }

  }

  search() {
    this.searchModel.mode = 'search';
    this.messageToEmit.emit(this.searchModel);
  }

  create(boolean) {
    this.router.navigate(['news-edit', boolean], { skipLocationChange: true });
  }

  view(param) {
    this.router.navigate(['news-edit', param], { skipLocationChange: true });
  }

  edit(param) {
    this.router.navigate(['news-edit', param], { skipLocationChange: true });
  }

  viewlist(param) {
    this.router.navigate(['news-viewlist', param], { skipLocationChange: true });
  }

  delete(param, idx) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.serviceProviderService.post('news/delete', { code: param.code }).subscribe(data => {
          this.toastr.success('ลบรายการเรียบร้อย', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          this.messageInput.splice(idx, 1);
        }, err => {
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });
  }

  deleteAll() {
    let model = '';

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        // check permission

        let chk = this.messageInput.filter(c => c.isSelected);

        chk.forEach(c => {
          // this.checkPermission(c.category, 'deleteAction');
          if (model == '') {
            model = c.code;
          }
          else {
            model = model + ',' + c.code;
          }
        })

        this.serviceProviderService.post('news/delete', { code: model }).subscribe(data => {
          this.toastr.success('ลบรายการเรียบร้อย', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }, err => {
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
    });
  }

  checkPermission(param, param2) {

    if (param2 == 'updateAction') {
      let model = this.permission.filter(c => c.title == param);
      if (model.length > 0) {
        return model[0].updateAction;
      }
    }
    else if (param2 == 'readAction') {
      let model = this.permission.filter(c => c.title == param);
      if (model.length > 0) {
        return model[0].readAction;
      }
    }
    else if (param2 == 'deleteAction') {
      let model = this.permission.filter(c => c.title == param);
      if (model.length > 0) {
        return model[0].deleteAction;
      }
    }

  }

  // start select user
  async isAllSelected(param, param2) {
    let status = await this.checkPermission(param, param2)
    if (status) {
      this.itemSelected = await this.messageInput.every(function (item: any) {
        return item.isSelected == true;
      })
    }
    this.getCheckedItemList();
  }

  async checkUncheckAll() {
    for (var i = 0; i < this.messageInput.length; i++) {
      // let status = await this.checkPermission(this.messageInput[i].category, 'deleteAction');

      // if(status) {
      this.messageInput[i].isSelected = this.itemSelected;
      // }
    }
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.itemSelectedList = [];
    for (var i = 0; i < this.messageInput.length; i++) {
      if (this.messageInput[i].isSelected)
        this.itemSelectedList.push(this.messageInput[i]);
    }
  }
  // end select uxs

  filterPerPage(perPage) {
    // call read by perpage
  }

  setPerPage(param) {
    this.searchModel.mode = 'search';
    this.searchModel.limit = parseInt(param);
    this.messageToEmit.emit(this.searchModel);
  }

  setTypeMessage(event){
    this.searchModel.typeMessage = '';
    this.searchModel.typeMessage = event;
    this.typeMessage.emit(event);
  }

  sendMessage() {    
    let model = '';
    let chk = this.messageInput.filter(c => c.isSelected);
    if (this.searchModel.typeMessage == "") {
      this.toastr.warning('กรุณาเลือกประเภทการส่ง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      return;
    }

    if (chk.length == 0) {
      this.toastr.warning('กรุณาเลือกข้อมูลที่จะส่ง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      return;
    }

 
    // this.spinner.show();
    chk.forEach(c => {
      if (model == '') {
        model = c.code;
      }
      else {
        model = model + ',' + c.code;
      }
    })

    // var regions:String[] = this.messageTagsAndRegions.regions;
    var tags = this.messageTagsAndRegions.listTag;

    this.searchModel.typeMessage == 'c'
    this.serviceProviderService.post('setQuota/checkQuota', { limit: chk.length }).subscribe(dataQuota => {
      let modelQuota: any = {};
      modelQuota = dataQuota;
      if (modelQuota.objectData) {
        this.serviceProviderService.post('news/sendMessage', {
          code: model
          , listTag: tags
          // , regions: regions
          , chkCard: this.searchModel.typeMessage == 'c' ? true : false
          , chkImage: this.searchModel.typeMessage == 'i' ? true : false
          , chkMessage: this.searchModel.typeMessage == 'm' ? true : false
          , chkVideo: this.searchModel.typeMessage == 'v' ? true : false
        }).subscribe(data => {
          this.toastr.success('ส่งข้อความเรียบร้อย', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          this.spinner.hide();
        }, err => {
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
          this.spinner.hide();
        });
      }
      else {
        this.spinner.hide();
        const dialogRef = this.dialog.open(ConfirmQuotaDialog, { disableClose: true });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            this.spinner.show();
            this.serviceProviderService.post('news/sendMessage', {
              code: model
              , listTag: tags
              // , regions: regions
              , chkCard: this.searchModel.typeMessage == 'c' ? true : false
              , chkImage: this.searchModel.typeMessage == 'i' ? true : false
              , chkMessage: this.searchModel.typeMessage == 'm' ? true : false
              , chkVideo: this.searchModel.typeMessage == 'v' ? true : false
            }).subscribe(data => {
              this.toastr.success('ส่งข้อความเรียบร้อย', 'แจ้งเตือนระบบ', { timeOut: 5000 });
              this.spinner.hide();
            }, err => {
              this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
              this.spinner.hide();
            });
          }
        });
      }
    }, err => {
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }
}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'confirm-delete-dialog.html',
})
export class ConfirmDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancel() {
    this.dialogRef.close(false);
  }

  ok() {
    this.dialogRef.close(true);
  }
}




@Component({
  selector: 'confirm-quota-dialog',
  templateUrl: 'confirm-quota-dialog.html',
})
export class ConfirmQuotaDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmQuotaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  cancel() {
    this.dialogRef.close(false);
  }

  ok() {
    this.dialogRef.close(true);
  }
}