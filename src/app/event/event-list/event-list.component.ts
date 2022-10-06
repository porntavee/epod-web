import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  @Input() messageInput: any = [];
  @Output() messageToEmit = new EventEmitter<any>();
  @Input() paginationModel: any = {}; // <----- Pagination
  category: any = {};
  permission: any;
  chkall: boolean = false;
  itemSelectedList: any = [];
  itemSelected: boolean = false;
  searchModel: any = {};

  constructor(private router: Router, private serviceProviderService: ServiceProviderService, public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    
    if (localStorage.getItem('category') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
    }

    if (localStorage.getItem('eventPage') != null) {
      this.permission = JSON.parse(localStorage.getItem('eventPage'));
    }

  }

  search() {
    this.searchModel.mode = 'search';
    this.messageToEmit.emit(this.searchModel);
  }
  create() {
    this.router.navigate(['event-edit', ''], { skipLocationChange: true });
  }

  view(param) {
    this.router.navigate(['event-edit', param], { skipLocationChange: true });
  }

  edit(param) {
    this.router.navigate(['event-edit', param], { skipLocationChange: true });
  }

  delete(param, idx) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.serviceProviderService.post('eventCalendar/delete', { code: param.code }).subscribe(data => {
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
        
        this.serviceProviderService.post('eventCalendar/delete', { code: model }).subscribe(data => {
          this.toastr.success('ลบรายการเรียบร้อย', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          setTimeout(() => {
            window.location.reload()
          },2000)
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
    if(status) {
      this.itemSelected = await this.messageInput.every(function (item: any) {
        return item.isSelected == true;
      })
    }
    this.getCheckedItemList();
  }

  async checkUncheckAll() {
    for (var i = 0; i < this.messageInput.length; i++) {
      let status = await this.checkPermission(this.messageInput[i].category, 'deleteAction');
      
      if(status) {
        this.messageInput[i].isSelected = this.itemSelected;
      }
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
