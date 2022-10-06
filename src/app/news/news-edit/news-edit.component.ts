import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ValidateService } from 'src/app/shared/validate.service';
import { OrganizationService } from 'src/app/shared/organization.service';
import { PermissionService } from 'src/app/shared/permission.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeyValue } from '@angular/common';
import { param } from 'jquery';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.css']
})
export class NewsEditComponent implements OnInit {
  Editor = ClassicEditor;
  listCategory: any = [];
  listProvince: any = [
    //_North
    { value: "เชียงราย", display: "เชียงราย", checkProvince: false },
    { value: "เชียงใหม่", display: "เชียงใหม่", checkProvince: false },
    { value: "น่าน", display: "น่าน", checkProvince: false },
    { value: "พะเยา", display: "พะเยา", checkProvince: false },
    { value: "แพร่", display: "แพร่", checkProvince: false },
    { value: "แม่ฮ่องสอน", display: "แม่ฮ่องสอน", checkProvince: false },
    { value: "ลำปาง", display: "ลำปาง", checkProvince: false },
    { value: "ลำพูน", display: "ลำพูน", checkProvince: false },
    { value: "อุตรดิตถ์", display: "อุตรดิตถ์", checkProvince: false },
    { value: "พิษณุโลก", display: "พิษณุโลก", checkProvince: false },
    { value: "สุโขทัย", display: "สุโขทัย", checkProvince: false },
    { value: "ตาก", display: "ตาก", checkProvince: false },
    { value: "กำแพงเพชร", display: "กำแพงเพชร", checkProvince: false },
    { value: "นครสวรรค์", display: "นครสวรรค์", checkProvince: false },
    { value: "พิจิตร", display: "พิจิตร", checkProvince: false },
    //_Eastern
    { value: "กาฬสินธุ์", display: "กาฬสินธุ์", checkProvince: false },
    { value: "ขอนแก่น", display: "ขอนแก่น", checkProvince: false },
    { value: "ชัยภูมิ", display: "ชัยภูมิ", checkProvince: false },
    { value: "นครพนม", display: "นครพนม", checkProvince: false },
    { value: "นครราชสีมา", display: "นครราชสีมา", checkProvince: false },
    { value: "บึงกาฬ", display: "บึงกาฬ", checkProvince: false },
    { value: "บุรีรัมย์", display: "บุรีรัมย์", checkProvince: false },
    { value: "มหาสารคาม", display: "มหาสารคาม", checkProvince: false },
    { value: "มุกดาหาร", display: "มุกดาหาร", checkProvince: false },
    { value: "ยโสธร", display: "ยโสธร", checkProvince: false },
    { value: "ร้อยเอ็ด", display: "ร้อยเอ็ด", checkProvince: false },
    { value: "เลย", display: "เลย", checkProvince: false },
    { value: "ศรีสะเกษ", display: "ศรีสะเกษ", checkProvince: false },
    { value: "สกลนคร", display: "สกลนคร", checkProvince: false },
    { value: "สุรินทร์", display: "สุรินทร์", checkProvince: false },
    { value: "หนองคาย", display: "หนองคาย", checkProvince: false },
    { value: "หนองบัวลำภู", display: "หนองบัวลำภู", checkProvince: false },
    { value: "อำนาจเจริญ", display: "อำนาจเจริญ", checkProvince: false },
    { value: "อุดรธานี", display: "อุดรธานี", checkProvince: false },
    { value: "อุบลราชธานี", display: "อุบลราชธานี", checkProvince: false },
    { value: "เพชรบูรณ์", display: "เพชรบูรณ์", checkProvince: false },
    //_Central
    { value: "อุทัยธานี", display: "อุทัยธานี", checkProvince: false },
    { value: "ชัยนาท", display: "ชัยนาท", checkProvince: false },
    { value: "สิงห์บุรี", display: "สิงห์บุรี", checkProvince: false },
    { value: "อ่างทอง", display: "อ่างทอง", checkProvince: false },
    { value: "พระนครศรีอยุธยา", display: "พระนครศรีอยุธยา", checkProvince: false },
    { value: "ลพบุรี", display: "ลพบุรี", checkProvince: false },
    { value: "สระบุรี", display: "สระบุรี", checkProvince: false },
    { value: "นครนายก", display: "นครนายก", checkProvince: false },
    { value: "ปราจีนบุรี", display: "ปราจีนบุรี", checkProvince: false },
    { value: "สระแก้ว", display: "สระแก้ว", checkProvince: false },
    { value: "ฉะเชิงเทรา", display: "ฉะเชิงเทรา", checkProvince: false },
    { value: "ชลบุรี", display: "ชลบุรี", checkProvince: false },
    { value: "ระยอง", display: "ระยอง", checkProvince: false },
    { value: "จันทบุรี", display: "จันทบุรี", checkProvince: false },
    { value: "ตราด", display: "ตราด", checkProvince: false },
    { value: "กรุงเทพมหานคร", display: "กรุงเทพมหานคร", checkProvince: false },
    { value: "นนทบุรี", display: "นนทบุรี", checkProvince: false },
    { value: "ปทุมธานี", display: "ปทุมธานี", checkProvince: false },
    { value: "สมุทรปราการ", display: "สมุทรปราการ", checkProvince: false },
    { value: "สมุทรสาคร", display: "สมุทรสาคร", checkProvince: false },
    { value: "สมุทรสงคราม", display: "สมุทรสงคราม", checkProvince: false },
    { value: "นครปฐม", display: "นครปฐม", checkProvince: false },
    { value: "สุพรรณบุรี", display: "สุพรรณบุรี", checkProvince: false },
    { value: "กาญจนบุรี", display: "กาญจนบุรี", checkProvince: false },
    { value: "ราชบุรี", display: "ราชบุรี", checkProvince: false },
    { value: "เพชรบุรี", display: "เพชรบุรี", checkProvince: false },
    { value: "ประจวบคีรีขันธ์", display: "ประจวบคีรีขันธ์", checkProvince: false },
    //_South
    { value: "กระบี่", display: "กระบี่", checkProvince: false },
    { value: "ชุมพร", display: "ชุมพร", checkProvince: false },
    { value: "ตรัง", display: "ตรัง", checkProvince: false },
    { value: "นครศรีธรรมราช", display: "นครศรีธรรมราช", checkProvince: false },
    { value: "นราธิวาส", display: "นราธิวาส", checkProvince: false },
    { value: "ปัตตานี", display: "ปัตตานี", checkProvince: false },
    { value: "พังงา", display: "พังงา", checkProvince: false },
    { value: "พัทลุง", display: "พัทลุง", checkProvince: false },
    { value: "ภูเก็ต", display: "ภูเก็ต", checkProvince: false },
    { value: "ยะลา", display: "ยะลา", checkProvince: false },
    { value: "ระนอง", display: "ระนอง", checkProvince: false },
    { value: "สงขลา", display: "สงขลา", checkProvince: false },
    { value: "สตูล", display: "สตูล", checkProvince: false },
    { value: "สุราษฎร์ธานี", display: "สุราษฎร์ธานี", checkProvince: false },
  ].sort((a, b) => a.display.localeCompare(b.display));
  editModel: any = {
    video: [],
    image: []
  };
  listTag: any = [];
  listTags: any = [];
  code: any;
  itemsList: any = {
    newsList: []
  };
  datalist: any = [];
  createList: boolean = false;
  title = 'เพิ่มข้อมูลแจ้งเตือนภัยล่วงหน้า';
  organization: any; // <----- Organization เก็บค่า องกรค์
  category: any; // <----- Category เพื่ออ่านสิทธิ์ Organization ของ User ว่าสามารถเห็นระดับไหน
  permission: any; // <----- Permission ส่งเข้า Read เพื่อให้เห็นเฉพาะ Category ที่ถูกเซตไว้กับ Role สรุปคือ (Category Code List)
  permissionList: any; // <----- PermissionList ไว้สำหรับตรวจสอบว่า Category มีสิทธิ์ในการ Create Read Update Read หรือเปล่า
  isSaveSuccess: boolean = false;
  lv0Category: any = []; // <----- Organization
  lv1Category: any = []; // <----- Organization
  lv2Category: any = []; // <----- Organization
  lv3Category: any = []; // <----- Organization
  lv4Category: any = []; // <----- Organization
  isReadOGLv0: boolean; // <----- Organization
  isReadOGLv1: boolean; // <----- Organization
  isReadOGLv2: boolean; // <----- Organization
  isReadOGLv3: boolean; // <----- Organization
  isReadOGLv4: boolean; // <----- Organization
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

    this.permission = this.permissionService.readPermission('newsPage');
    this.permissionList = this.permissionService.readLocalStorage('newsPage');
    this.organization = this.permissionService.readLocalStorage('organization');
    this.category = this.permissionService.readLocalStorage('category');

    this.activetedRoute.queryParams.subscribe(params => {
      let model: any = this.activetedRoute.snapshot.params;
      this.code = model.code;
      if (this.code == "false") {
        this.createList = false;
        this.code = '';
        this.editModel.textButton = 'รายละเอียด'
      }
      else if (this.code == "true") {
        this.createList = true;
        this.code = '';
        this.editModel.textButton = 'รายละเอียด'
      }
      else if (this.code != '') {
        this.title = 'แก้ไขข้อมูลแจ้งเตือนภัยล่วงหน้า';
        this.read();
      }
    });

    this.readTags();

  }

  create() {
    this.spinner.show();
    this.editModel.listTag = this.editModel.listTag.filter(f => f.checkTag).map(({ value }) => value);
    this.editModel.listProvince = this.editModel.listProvince.filter(f => f.checkProvince).map(({ value }) => value);
    this.serviceProviderService.post('setQuota/checkQuota', { limit: 0 }).subscribe(dataQuota => {
      let modelQuota: any = {};
      modelQuota = dataQuota;
      if (modelQuota.objectData) {
        this.editModel.imageUrl = this.editModel.image[0].imageUrl;

        // <----- Organization
        this.editModel = this.organizationService.filterSelected(this.editModel, this.lv0Category, this.lv1Category, this.lv2Category, this.lv3Category, this.lv4Category);
        // <----- Organization
        this.serviceProviderService.post(this.url.create, this.editModel).subscribe(data => {
          let model: any = {};
          model = data;

          // if (this.editModel.gallery.length > 0) {
          //   this.editModel.gallery.forEach(element => {
          //     element.reference = model.objectData.code;
          //     element.imageUrl = element.imageUrl;
          //     this.serviceProviderService.post(this.url.gallery.create, element).subscribe(data => { }, err => { });
          //   });
          // }
          this.isSaveSuccess = true;
          this.spinner.hide();
          this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 1000 });

          setTimeout(() => { this.back(); }, 2000);

        }, err => {
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else {
        this.spinner.hide();
        const dialogRef = this.dialog.open(ConfirmQuotaDialog, { disableClose: true });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            this.spinner.show();
            this.editModel.imageUrl = this.editModel.image[0].imageUrl;

            // <----- Organization
            this.editModel = this.organizationService.filterSelected(this.editModel, this.lv0Category, this.lv1Category, this.lv2Category, this.lv3Category, this.lv4Category);
            // <----- Organization

            this.serviceProviderService.post(this.url.create, this.editModel).subscribe(data => {

              let model: any = {};
              model = data;

              // if (this.editModel.gallery.length > 0) {
              //   this.editModel.gallery.forEach(element => {
              //     element.reference = model.objectData.code;
              //     element.imageUrl = element.imageUrl;
              //     this.serviceProviderService.post(this.url.gallery.create, element).subscribe(data => { }, err => { });
              //   });
              // }
              this.isSaveSuccess = true;
              this.spinner.hide();
              this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 1000 });

              setTimeout(() => { this.back(); }, 2000);

            }, err => {
              this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
            });

          }
        });
      }
    }, err => {
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  read() {
    this.spinner.show();
    this.serviceProviderService.post(this.url.read, { code: this.code, permission: this.permission }).subscribe(data => {
      let model: any = {};
      model = data;
      this.editModel = model.objectData[0];

      if (this.editModel.categoryList.length > 0)
        this.editModel.category = this.editModel.categoryList[0].code;

      if (this.editModel.provinces) {
        let provinces = this.editModel.provinces.split(",");
        provinces.forEach(f =>
          this.listProvince.find(fn => fn.value == f).checkProvince = true
        );
        if (this.listProvince.length == this.listProvince.filter(f => f.checkProvince).length)
          this.editModel.allProvince = true;

        this.editModel.listProvince = this.listProvince;
      }

      this.readCategory(this.editModel.language);
      this.galleryRead();

      // <----- Organization
      this.editModel.chkManualOG = true; // <----- Organization
      this.editModel.organization = 'manual'; // <----- Organization
      this.isReadOGLv0 = true; // <----- Organization
      this.isReadOGLv1 = true; // <----- Organization
      this.isReadOGLv2 = true; // <----- Organization
      this.isReadOGLv3 = true; // <----- Organization
      this.isReadOGLv4 = true; // <----- Organization
      // -----> Organization

      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  update() {
    if (this.editModel.image != undefined)
      this.editModel.imageUrl = this.editModel.image[0].imageUrl;
    // <----- Organization
    this.editModel = this.organizationService.filterSelected(this.editModel, this.lv0Category, this.lv1Category, this.lv2Category, this.lv3Category, this.lv4Category);
    // <----- Organization
    this.editModel.listTag = this.editModel.listTag.filter(f => f.checkTag).map(({ value }) => value);
    this.editModel.listProvince = this.editModel.listProvince.filter(f => f.checkProvince).map(({ value }) => value);
    this.spinner.show();
    this.serviceProviderService.post('setQuota/checkQuota', { limit: 0 }).subscribe(dataQuota => {
      let modelQuota: any = {};
      modelQuota = dataQuota;
      if (modelQuota.objectData) {
        this.serviceProviderService.post(this.url.update, this.editModel).subscribe(data => {

          this.serviceProviderService.post(this.url.gallery.delete, this.editModel).subscribe(data => {
            if (this.editModel.gallery.length > 0) {
              this.editModel.gallery.forEach(element => {
                // element.code = this.editModel.code; //เพิ่ม set active false ทั้วหมด
                element.reference = this.editModel.code;
                element.imageUrl = element.imageUrl;
                this.serviceProviderService.post(this.url.gallery.create, element).subscribe(data => { }, err => { });
              });
            }
          }, err => { });

          this.isSaveSuccess = true;
          this.spinner.hide();
          this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });

          setTimeout(() => {
            this.back();
          }, 2000);

        }, err => {
          this.toastr.error(err, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        });
      }
      else {
        this.spinner.hide();
        const dialogRef = this.dialog.open(ConfirmQuotaDialog, { disableClose: true });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            this.spinner.show();
            this.serviceProviderService.post(this.url.update, this.editModel).subscribe(data => {

              this.serviceProviderService.post(this.url.gallery.delete, this.editModel).subscribe(data => {
                if (this.editModel.gallery.length > 0) {
                  this.editModel.gallery.forEach(element => {
                    // element.code = this.editModel.code; //เพิ่ม set active false ทั้วหมด
                    element.reference = this.editModel.code;
                    element.imageUrl = element.imageUrl;
                    this.serviceProviderService.post(this.url.gallery.create, element).subscribe(data => { }, err => { });
                  });
                }
              }, err => { });

              this.isSaveSuccess = true;
              this.spinner.hide();
              this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 5000 });

              setTimeout(() => {
                this.back();
              }, 2000);

            }, err => {
              this.toastr.error(err, 'แจ้งเตือนระบบ', { timeOut: 5000 });
            });
          }
        });
      }
    }, err => {
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  readCategory(param: string) {
    this.editModel.language = param;
    if (this.editModel.language != '') {
      this.serviceProviderService.post('news/category/read', { language: param, permission: this.permission }).subscribe(data => {
        let model: any = {};
        model = data;
        this.listCategory = [];
        model.objectData.forEach(element => {
          this.listCategory.push({ value: element.code, display: element.title });
        });
      }, err => { });
    }
  }

  readTags() {
    this.serviceProviderService.postByPass('LineTag/read', {}).subscribe(data => {
      let model: any = {};
      model = data;
      model.objectData.forEach(element => {
        this.listTag.push({ value: element.code, display: element.title, checkTag: false });
      });
      this.listTags = this.listTag;
    }, err => { });

  }

  checkUncheckAll(ischeckTag) {
    if (ischeckTag != undefined && ischeckTag != null) {
      for (var i = 0; i < this.listProvince.length; i++) {
        this.listProvince[i].checkProvince = ischeckTag;
      }
      this.editModel.listProvince = this.listProvince;
    }
  }

  ChangeTag(data, ischeckTag) {
    if (ischeckTag != undefined && ischeckTag != null) {
      this.listTag.map(function (val, index) {
        if (val.value == data.value)
          return val.checkTag = ischeckTag;
      });

      this.editModel.listTag = this.listTag;
      // this.modelLineCriteria.emit(this.editModel);
    }
  }

  ChangeProvince(data, ischeckTag) {
    if (ischeckTag != undefined && ischeckTag != null) {
      this.listProvince.map(function (val, index) {
        if (val.value == data.value)
          return val.checkProvince = ischeckTag;
      });

      this.editModel.allProvince = this.listProvince.every(function (item: any) {
        return item.checkProvince == true;
      })

      this.editModel.listProvince = this.listProvince;
    }
  }

  galleryRead() {
    this.serviceProviderService.post('m/news/gallery/read', { code: this.editModel.code }).subscribe(data => {
      let model: any = {};
      model = data;
      this.editModel.gallery = model.objectData;
    }, err => { });
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  checkSave() {

    if (this.code != '') {
      // <----- Validate title, image, category
      this.editModel.category = undefined
      if (this.validService.isValidateUpdate(this.editModel))
        return;

      var check = false;
      if (this.editModel.chkImage == false) {
        if (this.editModel.linkUrl == '') {
          this.toastr.warning('กรุณาเพิ่มลิ้งค์แหล่งอ้างอิง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
          check = true;
        } else if (!this.validURL(this.editModel.linkUrl)) {
          this.toastr.warning('กรุณาใส่ลิ้งค์แหล่งอ้างอิงให้ถูกต้อง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
          check = true;
        }
      }
      if (this.editModel.description == '') {
        this.toastr.warning('กรุณาเพิ่มรายละเอียด', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (this.editModel.chkVideo == true) {
        if (this.editModel.video != undefined)
          if (this.editModel.video[0].videoUrl == '') {
            this.toastr.warning('กรุณาเพิ่มวิดีโอ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
            check = true;
          }
          else {
            this.editModel.videoUrl = this.editModel.video[0].videoUrl
          }
      }
      if (this.editModel.chkCard == false && this.editModel.chkImage == false && this.editModel.chkMessage == false && this.editModel.chkVideo == false) {
        this.toastr.warning('กรุณาเลือกรูปแบบข้อความ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (this.listProvince.filter(f => f.checkProvince).length == 0) {
        this.toastr.warning('กรุณาเลือกจังหวัด', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (check)
        return;

      this.checkPermission(this.editModel.category, 'updateAction')
    } else {
      // <----- Validate title, image, category
      if (this.validService.isValidateCreate(this.editModel))
        return;

      var check = false;
      if (this.editModel.chkImage == false) {
        if (this.editModel.linkUrl == '') {
          this.toastr.warning('กรุณาเพิ่มลิ้งค์แหล่งอ้างอิง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
          check = true;
        } else if (!this.validURL(this.editModel.linkUrl)) {
          this.toastr.warning('กรุณาใส่ลิ้งค์แหล่งอ้างอิงให้ถูกต้อง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
          check = true;
        }
      }
      if (this.editModel.description == '') {
        this.toastr.warning('กรุณาเพิ่มรายละเอียด', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (this.editModel.chkVideo == true) {
        if (this.editModel.video[0].videoUrl == '') {
          this.toastr.warning('กรุณาเพิ่มวิดีโอ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
          check = true;
        }
        else {
          this.editModel.videoUrl = this.editModel.video[0].videoUrl
        }
      }

      if (this.editModel.chkCard == false && this.editModel.chkImage == false && this.editModel.chkMessage == false && this.editModel.chkVideo == false) {
        this.toastr.warning('กรุณาเลือกรูปแบบข้อความ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (this.listProvince.filter(f => f.checkProvince).length == 0) {
        this.toastr.warning('กรุณาเลือกจังหวัด', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }

      if (check)
        return;


      this.checkPermission(this.editModel.category, 'createAction')
    }

  }

  checkPermission(param, param2) {
    if (param2 == 'createAction') {
      this.create();
      // let model = this.permissionList.filter(c => c.title == param);
      // if (model.length > 0 && this.code == '') {
      //   if (model[0].createAction)
      //     this.create();
      // }
    }
    else if (param2 == 'updateAction') {
      this.update();
      // let model = this.permissionList.filter(c => c.title == param);
      // if (model.length > 0 && this.code != '') {
      //   if (model[0].updateAction)
      //     this.update();
      // }
    }
    else if (param2 == 'approveAction') {
      let model = this.permissionList.filter(c => c.title == param);
      if (model.length > 0) {
        if (!model[0].approveAction) {
          this.editModel.isActive = false;
        }

        return model[0].approveAction;
      }
    }

  }

  // <----- Organization
  checkOG(param, param2) {

    if (param2 == 'auto') {
      this.editModel.organization = 'auto';
      this.editModel.chkAutoOG = param;
      this.editModel.chkManualOG = false;

      if (!this.editModel.chkAutoOG && !this.editModel.chkManualOG)
        this.editModel.chkAutoOG = true;
    }
    else if (param2 == 'manual') {
      this.editModel.organization = 'manual';
      this.editModel.chkAutoOG = false;
      this.editModel.chkManualOG = param;

      this.lv4Category = [];
      this.lv3Category = [];
      this.lv2Category = [];
      this.lv1Category = [];
      this.lv0Category = [];

      if (!this.editModel.chkAutoOG && !this.editModel.chkManualOG) {
        this.editModel.chkAutoOG = true;
        this.editModel.organization = 'auto';
      }

    }

    this.organization.forEach(og => {
      if (og.lv4 != '') {
        // this.editModel.organization = 'lv4';
        this.serviceProviderService.post('organization/read', { category: 'lv4' }).subscribe(data => {
          let model: any = {};
          model = data;

          let arr: any = [];
          let split = og.lv4.split(',');
          split.forEach(element => {
            let idx = model.objectData.findIndex(item => item.code === element);
            if (idx != -1) {

              let display = '';
              if (this.lv3Category.length > 0) {
                let idxy = this.lv3Category.findIndex(item => item.code === model.objectData[idx].lv0);
                if (idxy != -1)
                  display = this.lv3Category[idxy] + ' - ';

              }

              model.objectData[idx].display = display + model.objectData[idx].title;

              let idxx = this.lv4Category.findIndex(item => item.code === model.objectData[idx].code);
              if (idxx == -1)
                this.lv4Category.push(model.objectData[idx]);
              // arr.push({ title: model.objectData[idx].title, display: model.objectData[idx].title, code: model.objectData[idx].code, check: false });
            }
          });

          // this.lv4Category = arr;

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          //debugger
          setTimeout(() => {
            if (this.isReadOGLv4) {
              let lvContent = this.editModel.lv4.split(',');
              lvContent.forEach(element => {
                let idx = this.lv4Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv4Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv4', this.lv4Category[idx]);
                }
              });
              this.isReadOGLv4 = false;
            }
          }, 2500);

          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else if (og.lv3 != '') {
        // this.editModel.organization = 'lv3';
        this.serviceProviderService.post('organization/read', { category: 'lv3' }).subscribe(data => {
          let model: any = {};
          model = data;

          let arr: any = [];
          let split = og.lv3.split(',');
          split.forEach(element => {
            let idx = model.objectData.findIndex(item => item.code === element);
            if (idx != -1) {

              let display = '';
              if (this.lv2Category.length > 0) {
                let idxy = this.lv2Category.findIndex(item => item.code === model.objectData[idx].lv0);
                if (idxy != -1)
                  display = this.lv2Category[idxy] + ' - ';

              }

              model.objectData[idx].display = display + model.objectData[idx].title;

              let idxx = this.lv3Category.findIndex(item => item.code === model.objectData[idx].code);
              if (idxx == -1)
                this.lv3Category.push(model.objectData[idx]);
              // arr.push({ title: model.objectData[idx].title, display: model.objectData[idx].title, code: model.objectData[idx].code, check: false });
            }
          });


          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          //debugger
          setTimeout(() => {
            if (this.isReadOGLv3) {
              let lvContent = this.editModel.lv3.split(',');
              lvContent.forEach(element => {
                let idx = this.lv3Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv3Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv3', this.lv3Category[idx]);
                }
              });
              this.isReadOGLv3 = false;
            }
          }, 2000);

          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else if (og.lv2 != '') {
        // this.editModel.organization = 'lv2';
        this.serviceProviderService.post('organization/read', { category: 'lv2' }).subscribe(data => {
          let model: any = {};
          model = data;

          let arr: any = [];
          let split = og.lv2.split(',');
          split.forEach(element => {
            let idx = model.objectData.findIndex(item => item.code === element);
            if (idx != -1) {

              let display = '';
              if (this.lv1Category.length > 0) {
                let idxy = this.lv1Category.findIndex(item => item.code === model.objectData[idx].lv0);
                if (idxy != -1)
                  display = this.lv1Category[idxy] + ' - ';

              }

              model.objectData[idx].display = display + model.objectData[idx].title;

              let idxx = this.lv2Category.findIndex(item => item.code === model.objectData[idx].code);
              if (idxx == -1)
                this.lv2Category.push(model.objectData[idx]);
              // arr.push({ title: model.objectData[idx].title, display: model.objectData[idx].title, code: model.objectData[idx].code, check: false });
            }
          });

          // this.lv2Category = arr;

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          //debugger
          setTimeout(() => {
            if (this.isReadOGLv2) {
              let lvContent = this.editModel.lv2.split(',');
              lvContent.forEach(element => {
                let idx = this.lv2Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv2Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv2', this.lv2Category[idx]);
                }
              });
              this.isReadOGLv2 = false;
            }
          }, 1500);

          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else if (og.lv1 != '') {
        // this.editModel.organization = 'lv1';
        this.serviceProviderService.post('organization/read', { category: 'lv1' }).subscribe(data => {
          let model: any = {};
          model = data;

          let arr: any = [];
          let split = og.lv1.split(',');
          split.forEach(element => {
            let idx = model.objectData.findIndex(item => item.code === element);
            if (idx != -1) {

              let display = '';
              if (this.lv0Category.length > 0) {
                let idxy = this.lv0Category.findIndex(item => item.code === model.objectData[idx].lv0);
                if (idxy != -1)
                  display = this.lv0Category[idxy] + ' - ';

              }

              model.objectData[idx].display = display + model.objectData[idx].title;

              let idxx = this.lv1Category.findIndex(item => item.code === model.objectData[idx].code);
              if (idxx == -1)
                this.lv1Category.push(model.objectData[idx]);
              // arr.push({ title: model.objectData[idx].title, display: model.objectData[idx].title, code: model.objectData[idx].code, check: false });
            }
          });

          // this.lv1Category = arr;

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          //debugger
          setTimeout(() => {
            if (this.isReadOGLv1) {
              let lvContent = this.editModel.lv1.split(',');
              lvContent.forEach(element => {
                let idx = this.lv1Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv1Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv1', this.lv1Category[idx]);
                }
              });
              this.isReadOGLv1 = false;
            }
          }, 1000);

          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else if (og.lv0 != '') {
        // this.editModel.organization = 'lv0';
        this.serviceProviderService.post('organization/read', { category: 'lv0' }).subscribe(data => {
          let model: any = {};
          model = data;

          // let arr: any = [];
          let split = og.lv0.split(',');
          split.forEach(element => {
            let idx = model.objectData.findIndex(item => item.code === element);
            if (idx != -1) {
              model.objectData[idx].display = model.objectData[idx].title;

              let idxx = this.lv0Category.findIndex(item => item.code === model.objectData[idx].code);
              if (idxx == -1)
                this.lv0Category.push(model.objectData[idx]);
              // arr.push({ title: model.objectData[idx].title, display: model.objectData[idx].title, code: model.objectData[idx].code, check: false });
            }
          });

          // this.lv0Category = arr;

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          //debugger
          setTimeout(() => {
            if (this.isReadOGLv0) {
              let lvContent = this.editModel.lv0.split(',');
              lvContent.forEach(element => {
                let idx = this.lv0Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv0Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv0', this.lv0Category[idx]);
                }
              });
              this.isReadOGLv0 = false;
            }
          }, 500);

          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
    });


  }

  checkIsActiveNoti(param, param2) {
    if (param == undefined)
      return;
    if (param2 == "การ์ด") {
      this.editModel.chkCard = param;
      this.editModel.chkImage = false;
      this.editModel.chkMessage = false;
      this.editModel.chkVideo = false;
    }
    else if (param2 == "รูปภาพ") {
      this.editModel.chkCard = false;
      this.editModel.chkImage = param;
      this.editModel.chkMessage = false;
      this.editModel.chkVideo = false;
    }
    else if (param2 == "ข้อความ") {
      this.editModel.chkCard = false;
      this.editModel.chkImage = false;
      this.editModel.chkMessage = param;
      this.editModel.chkVideo = false;
    }
    else if (param2 == "วิดีโอ") {
      this.editModel.chkCard = false;
      this.editModel.chkImage = false;
      this.editModel.chkMessage = false;
      this.editModel.chkVideo = param;
    }
  }

  readCategoryByLv(param, lv, param2) {

    // หน่วยงาน
    if (lv == 'lv0') {

      param2.check = param;

      if (param2.check) {

        // เอาค่าใส่ให้ใหม่ทุกครั้งที่ติ๊ก
        // let chk = this.lv0Category.filter(c => c.check);
        // for (let index = 0; index < chk.length; index++) {
        //   if (index == 0)
        //     this.editModel.lv0 = chk[index].code;
        //   else
        //     this.editModel.lv0 = this.editModel.lv0 + ',' + chk[index].code;
        // }

        this.serviceProviderService.postByPass('organization/category/read', { category: 'lv1', lv0: param2.code }).subscribe(data => {
          let model: any = {};
          model = data;

          model.objectData.forEach(element => {
            let idx = this.lv1Category.findIndex(item => item.code === element.code);
            if (idx == -1) {
              element.display = param2.title + ' - ' + element.title;
              this.lv1Category.push(element);
            }
          });

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          setTimeout(() => {
            if (this.isReadOGLv1) {
              let lvContent = this.editModel.lv1.split(',');
              lvContent.forEach(element => {
                let idx = this.lv1Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv1Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv1', this.lv1Category[idx]);
                }
              });
              this.isReadOGLv1 = false;
            }
          }, 500);

        }, err => { });
      }
      else {

        for (let index = 0; index < 20; index++) {
          let idx = this.lv1Category.findIndex(item => item.lv0 === param2.code);
          if (idx != -1) {
            this.lv1Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv2Category.findIndex(item => item.lv0 === param2.code);
          if (idx != -1) {
            this.lv2Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv3Category.findIndex(item => item.lv0 === param2.code);
          if (idx != -1) {
            this.lv3Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv4Category.findIndex(item => item.lv0 === param2.code);
          if (idx != -1) {
            this.lv4Category.splice(idx, 1);
          }
        }

      }

    }

    // เขต
    else if (lv == 'lv1') {

      param2.check = param;

      if (param2.check) {

        this.serviceProviderService.postByPass('organization/category/read', { category: 'lv2', lv1: param2.code }).subscribe(data => {
          let model: any = {};
          model = data;

          model.objectData.forEach(element => {
            let idx = this.lv2Category.findIndex(item => item.code === element.code);
            if (idx == -1) {
              element.display = param2.title + ' - ' + element.title;
              this.lv2Category.push(element);
            }
          });

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          setTimeout(() => {
            if (this.isReadOGLv2) {
              let lvContent = this.editModel.lv2.split(',');
              lvContent.forEach(element => {
                let idx = this.lv2Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv2Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv2', this.lv2Category[idx]);
                }
              });
              this.isReadOGLv2 = false;
            }
          }, 500);

        }, err => { });
      }
      else {

        for (let index = 0; index < 20; index++) {
          let idx = this.lv2Category.findIndex(item => item.lv1 === param2.code);
          if (idx != -1) {
            this.lv2Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv3Category.findIndex(item => item.lv1 === param2.code);
          if (idx != -1) {
            this.lv3Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv4Category.findIndex(item => item.lv1 === param2.code);
          if (idx != -1) {
            this.lv4Category.splice(idx, 1);
          }
        }

      }

    }

    // จังหวัด
    else if (lv == 'lv2') {
      param2.check = param;

      if (param2.check) {
        this.serviceProviderService.postByPass('organization/category/read', { category: 'lv3', lv2: param2.code }).subscribe(data => {
          let model: any = {};
          model = data;

          model.objectData.forEach(element => {
            let idx = this.lv3Category.findIndex(item => item.code === element.code);
            if (idx == -1) {
              element.display = param2.title + ' - ' + element.title;
              this.lv3Category.push(element);
            }
          });

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          setTimeout(() => {
            if (this.isReadOGLv3) {
              let lvContent = this.editModel.lv3.split(',');
              lvContent.forEach(element => {
                let idx = this.lv3Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv3Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv3', this.lv3Category[idx]);
                }
              });
              this.isReadOGLv3 = false;
            }
          }, 500);

        }, err => { });
      }
      else {
        for (let index = 0; index < 20; index++) {
          let idx = this.lv3Category.findIndex(item => item.lv2 === param2.code);
          if (idx != -1) {
            this.lv3Category.splice(idx, 1);
          }
        }

        for (let index = 0; index < 20; index++) {
          let idx = this.lv4Category.findIndex(item => item.lv2 === param2.code);
          if (idx != -1) {
            this.lv4Category.splice(idx, 1);
          }
        }
      }

    }

    // อำเภอ/เขต
    else if (lv == 'lv3') {
      param2.check = param;

      if (param2.check) {

        this.serviceProviderService.postByPass('organization/category/read', { category: 'lv4', lv3: param2.code }).subscribe(data => {
          let model: any = {};
          model = data;

          model.objectData.forEach(element => {
            let idx = this.lv4Category.findIndex(item => item.code === element.code);
            if (idx == -1) {
              element.display = param2.title + ' - ' + element.title;
              this.lv4Category.push(element);
            }
          });

          //เช็คเฉพาะตอน edit check ค่ากลับเข้าไป
          setTimeout(() => {
            if (this.isReadOGLv4) {
              let lvContent = this.editModel.lv4.split(',');
              lvContent.forEach(element => {
                let idx = this.lv4Category.findIndex(item => item.code === element);
                if (idx != -1) {
                  this.lv4Category[idx].check = true;
                  this.readCategoryByLv(true, 'lv4', this.lv4Category[idx]);
                }
              });
              this.isReadOGLv3 = false;
            }
          }, 500);

        }, err => { });
      }
      else {
        for (let index = 0; index < 20; index++) {
          let idx = this.lv4Category.findIndex(item => item.lv3 === param2.code);
          if (idx != -1) {
            this.lv4Category.splice(idx, 1);
          }
        }
      }

    }

    // ตำบล/แขวง
    else if (lv == 'lv4') {
      param2.check = param;
    }

  }
  // -----> Organization

  addDataList() {
    if (this.validService.isValidateCreate(this.editModel))
      return;

    var check = false;
    if (this.editModel.linkUrl == '') {
      this.toastr.warning('กรุณาเพิ่มลิ้งค์แหล่งอ้างอิง', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      check = true;
    }
    if (this.editModel.description == '') {
      this.toastr.warning('กรุณาเพิ่มรายละเอียด', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      check = true;
    }

    if (this.editModel.chkVideo == true) {
      if (this.editModel.video.length == 0) {
        this.toastr.warning('กรุณาเพิ่มวิดีโอ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }
      else if (this.editModel.video[0].videoUrl == '') {
        this.toastr.warning('กรุณาเพิ่มวิดีโอ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        check = true;
      }
      else {
        this.editModel.videoUrl = this.editModel.video[0].videoUrl
      }
    }
    if (!this.editModel.chkCard && !this.editModel.chkImage && !this.editModel.chkMessage && !this.editModel.chkVideo) {
      this.toastr.warning('กรุณาเลือกประเภท', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      check = true;
    }

    if (check)
      return;

    this.editModel.imageUrl = this.editModel.image[0].imageUrl;
    if (this.editModel.listTag != undefined) {
      this.editModel.listTag = this.editModel.listTag.filter(f => f.checkTag).map(({ value }) => value);
      this.listTag.map(m => m.checkTag = false);
    }


    // <----- Organization
    this.editModel = this.organizationService.filterSelected(this.editModel, this.lv0Category, this.lv1Category, this.lv2Category, this.lv3Category, this.lv4Category);
    // <----- Organization
    this.datalist.push(this.editModel);
    this.editModel = {
      video: [],
      image: []
    };
  }


  deleteItem(index) {
    this.datalist.splice(index, 1);
  }

  createListApi() {

    if (this.datalist.length == 0) {
      this.toastr.warning('กรุณาเพื่มข้อมูล', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      return;
    }

    this.spinner.show();
    this.itemsList.newsList = this.datalist;
    var limit = 0;
    limit += Math.ceil(this.itemsList.newsList.filter(f => f.chkCard).length / 10);
    limit += this.itemsList.newsList.filter(f => f.chkImage).length;
    limit += this.itemsList.newsList.filter(f => f.chkMessage).length;
    limit += this.itemsList.newsList.filter(f => f.chkVideo).length;
    this.serviceProviderService.post('setQuota/checkQuota', { limit: limit }).subscribe(dataQuota => {
      let modelQuota: any = {};
      modelQuota = dataQuota;
      if (modelQuota.objectData) {

        this.serviceProviderService.post(this.url.create + "List", this.itemsList).subscribe(data => {

          let model: any = {};
          model = data;

          this.isSaveSuccess = true;
          this.spinner.hide();
          this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 1000 });

          setTimeout(() => { this.back(); }, 2000);

        }, err => {
          this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
        });
      }
      else {
        this.spinner.hide();
        const dialogRef = this.dialog.open(ConfirmQuotaDialog, { disableClose: true });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            this.spinner.show();
            this.serviceProviderService.post(this.url.create + "List", this.itemsList).subscribe(data => {

              let model: any = {};
              model = data;

              this.isSaveSuccess = true;
              this.spinner.hide();
              this.toastr.success('บันทึกข้อมูลสำเร็จ', 'แจ้งเตือนระบบ', { timeOut: 1000 });

              setTimeout(() => { this.back(); }, 2000);

            }, err => {
              this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
            });
          }
        });
      }
    }, err => {
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  // ----- rewrite -----

  api = {
    title1: 'สร้างข่าวสาร',
    title2: 'ระบบข่าวสารประชาสัมพันธ์',
    // create: 'autoReply/create',
    // read: 'autoReply/read',
    // update: 'autoReply/update',
    // delete: 'autoReply/delete'
  };

  selectedTags(param) {
    this.editModel.tags = param;
  }

  // ----- ------- -----
  back() {
    this.router.navigate(['news'], { skipLocationChange: true });
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