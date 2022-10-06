import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'app-drop-zone',
  templateUrl: './drop-zone.component.html',
  styleUrls: ['./drop-zone.component.css']
})
export class DropZoneComponent implements OnInit {

  constructor(private fileuploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  fileSingleModel: any = [];
  fileGelleryModel: any = [];
  files: File[] = [];

  onSelect(event) {
    console.log('event', event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  // Custom
  onSelectApi(event, param) {
    console.log('event', event);
    this.fileuploadService.postFile('หน้าจอ', event.addedFiles[0]).subscribe(data => {

      // debugger

      // this.imgx = new File([data], "myImage.png");
      // let x: any;
      // this.getBase64ImageFromUrl(data)
      //   .then(result => {
      //     debugger
      //     this.base64 = result;
      //   })
      //   .catch(err => console.error(err));

      // debugger
      if (param)
        this.fileGelleryModel.push(data);
      else
        this.fileSingleModel[0] = data;
    });
  }

  onRemoveApi(event, param) {
    console.log(event);
    if (param)
      this.fileGelleryModel.splice(this.fileGelleryModel.indexOf(event), 1);
    else
      this.fileSingleModel.splice(this.fileGelleryModel.indexOf(event), 1);
  }

  async getBase64ImageFromUrl(param) {
    var res = await fetch(param.imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
}
