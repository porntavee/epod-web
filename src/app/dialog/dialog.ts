import { Component, Inject, ChangeDetectorRef, AfterContentChecked } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ServiceProviderService } from "../shared/service-provider.service";
import * as XLSX from 'xlsx-js-style';
import { NgxSpinnerService } from 'ngx-spinner';


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
    selector: 'masterdata-dialog',
    templateUrl: 'masterdata-dialog.html',
})
export class MasterDataDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<MasterDataDialog>,
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
        this.serviceProviderService.post(this.data.urlapi, criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'location-address-dialog',
    templateUrl: 'location-address-dialog.html',
})
export class LocationAddressDataDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<LocationAddressDataDialog>,
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
        this.serviceProviderService.post(this.data.urlapi, criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}



@Component({
    selector: 'group-user-dialog',
    templateUrl: 'group-user-dialog.html',
})
export class GroupUserDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}


@Component({
    selector: 'route-dialog',
    templateUrl: 'route-dialog.html',
})
export class RouteDialog implements AfterContentChecked {

    constructor(public changeDetector: ChangeDetectorRef,
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'type-of-work-dialog',
    templateUrl: 'type-of-work-dialog.html',
})
export class TypeOfWorkDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'type-of-work-dialog',
    templateUrl: 'type-of-work-dialog.html',
})
export class StatusDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'ship-to-dialog',
    templateUrl: 'ship-to-dialog.html',
})
export class ShipToDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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
            "Fillter": this.criteriaModel.Fillter,
            "IsHub": (this.data.IsHub == undefined || this.data.IsHub == false) ? '' : 'Y',
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'transport-no-dialog',
    templateUrl: 'transport-no-dialog.html',
})
export class TransportNoDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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
            "Process": this.data.Process
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'vehicle-dialog',
    templateUrl: 'vehicle-dialog.html',
})
export class VehicleDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}


@Component({
    selector: 'driver-dialog',
    templateUrl: 'driver-dialog.html',
})
export class DriverDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
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
            "GroupCode": "D",
            "Fillter": this.criteriaModel.Fillter,
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

    // filter() {
    //     //   if ((this.criteriaModel.Code != undefined && this.criteriaModel.Code != '') && (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != ''))
    //     // this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code) && c.firstName.includes(this.criteriaModel.FirstName));
    //     if (this.criteriaModel.Code != undefined && this.criteriaModel.Code != '')
    //         this.data.listData = this.data.listDataSearch.filter(c => c.Code.includes(this.criteriaModel.Code));
    //     //   else if (this.criteriaModel.FirstName != undefined && this.criteriaModel.FirstName != '')
    //     // this.data.listData = this.data.listDataSearch.filter(c => c.firstName.includes(this.criteriaModel.FirstName));
    //     else
    //         this.data.listData = this.data.listDataSearch
    // }

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'province-dialog',
    templateUrl: 'province-dialog.html',
})
export class ProvinceDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<ProvinceDialog>,
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
        this.serviceProviderService.post('api/Masters/GetProvince', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'district-dialog',
    templateUrl: 'district-dialog.html',
})
export class DistrictDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<DistrictDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": this.serviceProviderService.userinformation,
            "ProvinceId": this.data.ProvinceId,
            "Fillter": this.criteriaModel.Fillter
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetDistrict', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}



@Component({
    selector: 'routing-dialog',
    templateUrl: 'routing-dialog.html',
})
export class RoutingDialog implements AfterContentChecked {
    constructor(
        public dialogRef: MatDialogRef<RoutingDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetector: ChangeDetectorRef,) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": this.serviceProviderService.userinformation,
            "Fillter": this.criteriaModel.Fillter
        }

        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetRoute', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

}

@Component({
    selector: 'subrouting-dialog',
    templateUrl: 'subrouting-dialog.html',
})
export class SubRoutingDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<SubRoutingDialog>,
        private serviceProviderService: ServiceProviderService,
        private toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.read();
    }

    criteriaModel: any = {};

    read() {
        let criteria = {
            "userinformation": this.serviceProviderService.userinformation,
            "RouteId": this.data.RouteId,
            "Fillter": this.criteriaModel.Fillter,
        }
        // let json = JSON.stringify(criteria);
        this.serviceProviderService.post('api/Masters/GetSubRoute', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'region-dialog',
    templateUrl: 'region-dialog.html',
})
export class RegionDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<RegionDialog>,
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
        this.serviceProviderService.post('api/Masters/GetRegion', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'routing-dialog',
    templateUrl: 'routing-dialog.html',
})
export class JobStatusDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<RoutingDialog>,
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
        this.serviceProviderService.post('api/Masters/GetJobStatus', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'docreturn-dialog',
    templateUrl: 'docreturn-dialog.html',
})
export class DocReturnDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<RoutingDialog>,
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
        this.serviceProviderService.post('api/Transport/GetReturnNo', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}


@Component({
    selector: 'upload-order-dialog',
    templateUrl: 'upload-order-dialog.html',
})
export class UploadOrderDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    cancel() {
        this.dialogRef.close(false);
    }

    ok() {
        this.dialogRef.close(this.listData);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    // excel
    listData: any = [];
    onFileChange(ev) {
        this.spinner.show();
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                this.listData = initial[name];
                // debugger
                initial[name].forEach((e, i) => {
                    Object.entries(e).forEach(([, value], index) => {
                        if (index == 0)
                            this.listData[i].codeShort = value.toString();
                        if (index == 1)
                            this.listData[i].titleShort = value;
                        if (index == 2)
                            this.listData[i].title = value;
                        if (index == 3)
                            this.listData[i].titleEN = value;
                    });
                });
                this.spinner.hide();
                // return initial;
            }, {});
        }
        reader.readAsBinaryString(file);
    }
}

@Component({
    selector: 'joborder-status-dialog',
    templateUrl: 'joborder-status-dialog.html',
})
export class JobOrderStatusDialog implements AfterContentChecked {
    constructor(
        public changeDetector: ChangeDetectorRef,
        public dialogRef: MatDialogRef<JobOrderStatusDialog>,
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
        this.serviceProviderService.post('api/Masters/GetJobOrderStatus', criteria).subscribe(data => {
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

    cancel() {
        this.dialogRef.close(undefined);
    }

    ok(param) {
        this.dialogRef.close(param);
    }

    // Fixing "Expression has changed after it was checked"
    public ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }
}

@Component({
    selector: 'print-dialog',
    templateUrl: 'print-dialog.html',
})
export class PrintDialog {

    calPage = 1;
    dataPage:any = [];
    gIndex = 0;
    

    constructor(
        public dialogRef: MatDialogRef<PrintDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.calPage = Math.ceil(data.List.length / 10);

        let x: any = [];
        for (let index = 0; index < this.calPage; index++) {
            x.push(data.List[0+(index*10)]); // 0+(0*10)= 0     0+(1*10)= 10
            x.push(data.List[1+(index*10)]); // 1+(0*10)= 1     1+(1*10)= 11
            x.push(data.List[2+(index*10)]); // 2+(0*10)= 2
            x.push(data.List[3+(index*10)]);
            x.push(data.List[4+(index*10)]);
            x.push(data.List[5+(index*10)]);
            x.push(data.List[6+(index*10)]);
            x.push(data.List[7+(index*10)]);
            x.push(data.List[8+(index*10)]);
            x.push(data.List[9+(index*10)]);

            this.dataPage.push(x);
            x = [];
        }

        debugger

        // data.List.array.forEach(element => {

        // });


    }

    checkLastPage() {
        return false;
    }

    cancel() {
        this.dialogRef.close(false);
    }

    ok() {
        this.dialogRef.close(true);
    }
}

@Component({
    selector: 'close-job-dialog',
    templateUrl: 'close-job-dialog.html',
})
export class CloseJobDialog {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    reason: any = '';

    cancel() {
        this.dialogRef.close(false);
    }

    ok() {
        this.dialogRef.close(this.reason);
    }
}