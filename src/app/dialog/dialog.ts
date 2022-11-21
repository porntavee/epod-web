import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ServiceProviderService } from "../shared/service-provider.service";

@Component({
    selector: 'confirm-dialog',
    templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialog {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    cancel() {
        this.dialogRef.close(false);
    }

    ok() {
        this.dialogRef.close(true);
    }
}

@Component({
    selector: 'group-user-dialog',
    templateUrl: 'group-user-dialog.html',
})
export class GroupUserDialog {
    constructor(
        public dialogRef: MatDialogRef<GroupUserDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": this.serviceProviderService.userinformation,
            "Code": ""
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetGroupUser', criteria).subscribe(data => {
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
        if (this.criteriaModel.Code != undefined && this.criteriaModel.Code != '')
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code));
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
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.toUpperCase().includes(this.criteriaModel.Code.toUpperCase()));
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
            "userinformation": this.serviceProviderService.userinformation,
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
    selector: 'type-of-work-dialog',
    templateUrl: 'type-of-work-dialog.html',
})
export class StatusDialog {
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
            "userinformation": this.serviceProviderService.userinformation,
            "Code": ""
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetTransportStatus', criteria).subscribe(data => {
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
            "userinformation": this.serviceProviderService.userinformation,
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

@Component({
    selector: 'transport-no-dialog',
    templateUrl: 'transport-no-dialog.html',
})
export class TransportNoDialog {
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
            "userinformation": this.serviceProviderService.userinformation,
            "TransportNo": this.criteriaModel.TransportNo,
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Transport/GetTransportHeader', criteria).subscribe(data => {
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
        if (this.criteriaModel.TransportNo != undefined && this.criteriaModel.TransportNo != '')
            this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.TransportNo));
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
    selector: 'vehicle-dialog',
    templateUrl: 'vehicle-dialog.html',
})
export class VehicleDialog {
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
            "userinformation": this.serviceProviderService.userinformation,
            "Fillter": this.criteriaModel.Fillter
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetVehicle', criteria).subscribe(data => {
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
    selector: 'driver-dialog',
    templateUrl: 'driver-dialog.html',
})
export class DriverDialog {
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
            "userinformation": this.serviceProviderService.userinformation,
            "GroupCode": "D"
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetUser', criteria).subscribe(data => {
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
