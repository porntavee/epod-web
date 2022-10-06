import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'cdsl',
  templateUrl: './dropzone-single-large.component.html',
  styleUrls: ['./dropzone-single-large.component.css']
})
export class DropzoneSingleLargeComponent implements OnInit {

  @Input() label;
  @Input() data:any = [];
  @Input() code = 'none';
  @Output() cModel = new EventEmitter<string>();

  constructor(private fileuploadService: FileUploadService, private toastr: ToastrService) { }

  ngOnInit(): void {

    if (this.data[0].imageUrl == '')
      this.data = [];

    this.cModel.emit(this.data);
  }

  onSelectApi(event) {
    console.log('event', event);

    if (event.addedFiles[0].type == 'image/png' || event.addedFiles[0].type == 'image/jpeg' || event.addedFiles[0].type == 'image/gif') {
      if (event.addedFiles[0].size > 10000000) {
        event.addedFiles = [];
        return this.toastr.warning('รูปภาพต้องมีขนาดไม่เกิน 10 mb', 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }else{
        let type = event.addedFiles[0].type || '';
        event.addedFiles = [];
        return this.toastr.warning('ไม่รองรับรูปแบบไฟล์ : ' + type , 'แจ้งเตือนระบบ', { timeOut: 5000 });
    }

    // debugger
    this.fileuploadService.postFile(this.code, event.addedFiles[0]).subscribe(data => {
      debugger
        this.data[0] = data;
        this.cModel.emit(this.data);
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
