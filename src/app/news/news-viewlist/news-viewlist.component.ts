import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ValidateService } from 'src/app/shared/validate.service';
import { OrganizationService } from 'src/app/shared/organization.service';
import { PermissionService } from 'src/app/shared/permission.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-news-viewlist',
  templateUrl: './news-viewlist.component.html',
  styleUrls: ['./news-viewlist.component.css']
})
export class NewsViewlistComponent implements OnInit {
  Editor = ClassicEditor;
  editModel: any = {
    video: [],
    image: []
  };
  code: any;
  title = 'ดูจำนวนคนอ่าน/จำนวนทั้งหมด';
  url: any = {};


  constructor(private validService: ValidateService
    , private organizationService: OrganizationService
    , private permissionService: PermissionService
    , private serviceProviderService: ServiceProviderService
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , private router: Router
    , private activetedRoute: ActivatedRoute
    , public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.activetedRoute.queryParams.subscribe(params => {
      let model: any = this.activetedRoute.snapshot.params;
      this.code = model.code;
      this.read();
    });

  }
  read() {
    this.spinner.show();
    this.serviceProviderService.post('', { code: this.code }).subscribe(data => {
      let model: any = {};
      model = data;
      this.editModel = model.objectData;

      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  api = {
    title1: 'สร้างข่าวสาร',
    title2: 'ดูจำนวนคนอ่าน/จำนวนทั้งหมด',
  };

  back() {
    this.router.navigate(['news'], { skipLocationChange: true });
  }
}