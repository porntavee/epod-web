import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [ FileUploadService ]
})
export class FileUploadComponent implements OnInit {
  imageUrl: string = '/assets/img/404.png';
  fileToUpload: File = null;
  constructor(private fileuploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(Caption, Image) {
    // this.imageService.getFile().subscribe(data => {
    //   debugger
    // });
    
    // this.fileuploadService.post().subscribe(data => {
    //   debugger
    // });
    
    this.fileuploadService.postFile(Caption.value, this.fileToUpload).subscribe(data => {
      debugger
    });
  }
}
