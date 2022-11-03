import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ServiceProviderService } from "../shared/service-provider.service";

@Component({
    selector: 'route-dialog',
    templateUrl: 'route-dialog.html',
})
export class RouteDialog {
    constructor(
        public dialogRef: MatDialogRef<RouteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    criteriaModel: any = {};

    read() {
        //   if ((this.criteriaModel.Code != undefined && this.criteriaModel.Code != '') && (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != ''))
        // this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code) && c.firstName.includes(this.criteriaModel.FirstName));
        if (this.criteriaModel.Code != undefined && this.criteriaModel.Code != '')
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code));
        //   else if (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != '')
        // this.data.listData = this.data.listDataSearch.filter(c => c.firstName.includes(this.criteriaModel.FirstName));
        else
            this.data.listData = this.data.listDataSearch
    }

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }
}

@Component({
    selector: 'type-of-work-dialog',
    templateUrl: 'type-of-work-dialog.html',
})
export class TypeOfWorkDialog {
    constructor(
        public dialogRef: MatDialogRef<RouteDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": {
                "UserName": "dhong",
                "GroupCode": "A",
                "dbName": "WTX-EPOD",
                "Version": "22.09.08.01"
            },
            "Code": ""
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetTransportType', criteria).subscribe(data => {
            let model: any = {};
            model = data;

            if (model.Status) {
                this.data.listData = model.Data;
            }
            else {
                this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
            }
        }, err => {
            this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
    }

    filter() {
        //   if ((this.criteriaModel.Code != undefined && this.criteriaModel.Code != '') && (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != ''))
        // this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code) && c.firstName.includes(this.criteriaModel.FirstName));
        if (this.criteriaModel.Code != undefined && this.criteriaModel.Code != '')
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code));
        //   else if (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != '')
        // this.data.listData = this.data.listDataSearch.filter(c => c.firstName.includes(this.criteriaModel.FirstName));
        else
            this.data.listData = this.data.listDataSearch
    }

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }
}

@Component({
    selector: 'ship-to-dialog',
    templateUrl: 'ship-to-dialog.html',
})
export class ShipToDialog {
    constructor(
        public dialogRef: MatDialogRef<RouteDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": {
                "UserName": "dhong",
                "GroupCode": "A",
                "dbName": "WTX-EPOD",
                "Version": "22.09.08.01"
            },
            "Fillter": this.criteriaModel.Code,
            "Limit": 100
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetShipto', criteria).subscribe(data => {
            let model: any = {};
            model = data;

            if (model.Status) {
                this.data.listData = model.Data;
            }
            else {
                this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
            }
        }, err => {
            this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
    }

    filter() {
        //   if ((this.criteriaModel.Code != undefined && this.criteriaModel.Code != '') && (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != ''))
        // this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code) && c.firstName.includes(this.criteriaModel.FirstName));
        if (this.criteriaModel.Code != undefined && this.criteriaModel.Code != '')
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code));
        //   else if (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != '')
        // this.data.listData = this.data.listDataSearch.filter(c => c.firstName.includes(this.criteriaModel.FirstName));
        else
            this.data.listData = this.data.listDataSearch
    }

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }
}