import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import convert from 'image-file-resize';



@Component({
  selector: 'cds',
  templateUrl: './dropzone-single.component.html',
  styleUrls: ['./dropzone-single.component.css']
})
export class DropzoneSingleComponent implements OnInit {
  imagePdf = './../../../assets/img/267px-PDF_file_icon.svg.png';
  @Input() label;
  @Input() data: any = [];
  @Input() code = 'none';
  @Output() cModel = new EventEmitter<string>();
  @Input() set categoryId(value: string) {
    if (value.length == 0) {
      this.data.splice(0, 1);
    }
  }


  constructor(private fileuploadService: FileUploadService, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.data.length == 0)
      this.data = [];
    else if (this.data[0].imageUrl == '')
      this.data = [];

    this.cModel.emit(this.data);
  }

  async onSelectApi(event) {
    // console.log('event', event);
    if (event.addedFiles[0].type == 'image/png' || event.addedFiles[0].type == 'image/jpeg' || event.addedFiles[0].type == 'image/gif') {
      if (event.addedFiles[0].size > 10000000) {
        event.addedFiles = [];
        return this.toastr.warning('รูปภาพต้องมีขนาดไม่เกิน 10 mb', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
      else if (event.addedFiles[0].size > 1000000) {
        let allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg'];

        let fullName = event.addedFiles[0].name;
        let subNameType = fullName.substring((fullName.length - 4));
        let subName = '';
        if (allow.find(element => element == subNameType) != null)
          subName = fullName.substring(0, (fullName.length - 5)).replace(".", " ") + "." + subNameType;
        else if (allow.find(element => element == subNameType.substring(1)) != null)
          subName = fullName.substring(0, (fullName.length - 4)).replace(".", " ") + "." + subNameType.substring(1);

        if (subName != '') {
          var file = event.addedFiles[0];
          var blob = file.slice(0, event.addedFiles[0].size, event.addedFiles[0].type);
          event.addedFiles[0] = new File([blob], subName, { type: event.addedFiles[0].type });
        }
        
        var wh = 400;
        var size = event.addedFiles[0].size;
        while (size > 1000000) {
          await convert({
            file: event.addedFiles[0],
            width: wh * 8,
            height: wh * 10,
            type: event.addedFiles[0].type
          }).then(resp => {
            size = resp.size;
            if (resp.size > 1000000)
              wh = wh - 50;
            else
              event.addedFiles[0] = resp;
            // Response contain compressed and resized file
          }).catch(error => {
            // Error
            // return this.toastr.warning('ไม่สามารถบีบอัดไฟล์ได้', 'แจ้งเตือนระบบ', { timeOut: 5000 });
          })
        }
        // event.addedFiles[0] = await this.resizeImage(event.addedFiles[0], wh, event.addedFiles[0].type);
      }
    } else if (event.addedFiles[0].type == 'application/pdf') {
      if (event.addedFiles[0].size > 100000000) {
        event.addedFiles = [];
        return this.toastr.warning('ไฟล์ต้องมีขนาดไม่เกิน 100 mb', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    } else {
      let type = event.addedFiles[0].type || '';
      event.addedFiles = [];
      return this.toastr.warning('ไม่รองรับรูปแบบไฟล์ : ' + type, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    }

    this.fileuploadService.postFile(this.code, event.addedFiles[0]).subscribe(data => {

      this.data[0] = data;
      if (this.data[0].imageType == 'application/pdf') {
        this.data[0].filePdf = this.data[0].imageUrl;
        this.data[0].imageUrl = this.imagePdf;
      }

      this.cModel.emit(this.data);
    }, err => {
      console.log('error ', err);

    });
  }

  onRemoveApi(event) {
    this.data.splice(this.data.indexOf(event), 1);
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param);
  }

  chkimageUrl(param){

  }
}

