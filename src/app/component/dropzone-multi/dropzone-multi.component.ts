import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'cdm',
  templateUrl: './dropzone-multi.component.html',
  styleUrls: ['./dropzone-multi.component.css']
})
export class DropzoneMultiComponent implements OnInit {

  @Input() label;
  @Input() data: any = [];
  @Input() code = 'none';
  @Output() cModel = new EventEmitter<string>();

  constructor(private fileuploadService: FileUploadService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  onSelectApi(event, param) {
    // console.log('event', event);
    event.addedFiles.forEach(element => {
      if (element.type == 'image/png' || element.type == 'image/jpeg' || element.type == 'image/gif') {
        if (element.size > 10000000) {
          element = [];
          return this.toastr.warning('รูปภาพต้องมีขนาดไม่เกิน 10 mb', 'แจ้งเตือนระบบ', { timeOut: 5000 });
        }
      } else {
        let type = element.type || '';
        element = [];
        return this.toastr.warning('ไม่รองรับรูปแบบไฟล์ : ' + type, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }

      this.fileuploadService.postFile(this.code, element).subscribe(data => {
        this.data.push(data);
        this.cModel.emit(this.data);
      });
    });

  }

  onRemoveApi(event, param) {
    this.data.splice(this.data.indexOf(event), 1);
  }

}
