import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../shared/file-upload.service';

@Component({
  selector: 'cdsv',
  templateUrl: './dropzone-video.component.html',
  styleUrls: ['./dropzone-video.component.css']
})
export class DropzoneVideoComponent implements OnInit {
  videoPdf = './../../../assets/img/267px-PDF_file_icon.svg.png';
  @Input() label;
  @Input() data: any = [];
  @Input() code = 'none';
  @Output() cModel = new EventEmitter<string>();
  @Input() set categoryId(value: string) {
    if (value.length == 0) {
      this.data.splice(0, 1);
    }
 }
  isdisabled: boolean = false;

  constructor(private fileuploadService: FileUploadService, private toastr: ToastrService) { }
  ngOnInit(): void {

    if (this.data[0].videoUrl == '')
      this.data = [];

    this.cModel.emit(this.data);
  }

  onSelectApi(event) {
    // console.log('event', event);
    
    if (event.addedFiles[0].type == 'video/mp4') {
      if (event.addedFiles[0].size > 100000000) {
        event.addedFiles = [];
        return this.toastr.warning('รูปภาพต้องมีขนาดไม่เกิน 100 mb', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }
    else{
      let type = event.addedFiles[0].type || '';
      event.addedFiles = [];
      return this.toastr.warning('ไม่รองรับรูปแบบไฟล์ : ' + type, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    }
    var labelold = this.label;
    this.isdisabled = true;
    this.label = "กำลังอัพโหลดวีดีโอ กรุณารอสักครู่";
    this.fileuploadService.postFileVideo(this.code, event.addedFiles[0]).subscribe(data => {
      this.isdisabled = false;
      this.label = labelold;
      this.data[0] = data;
      if (this.data[0].videoType == 'application/pdf') {
        this.data[0].filePdf = this.data[0].videoUrl;
        this.data[0].videoUrl = this.videoPdf;
      }

      this.cModel.emit(this.data);
    }, err => {
      this.isdisabled = false;
      this.label = labelold;
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

}
