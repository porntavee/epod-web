import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  postFile(caption: string, fileToUpload: File) {
    // const endpoint = 'http://localhost:5601/upload';

    // product
    // const endpoint = 'https://lineoa.we-builds.com/lineoa-document/upload';
    const endpoint = 'https://line-ddpm.we-builds.com/document/upload';

    // training
    // const endpoint = 'https://training-ddpm.we-builds.com/training-document/upload';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('ImageCaption', caption);
    return this.http.post(endpoint, formData);
  }

  postFileVideo(caption: string, fileToUpload: File) {
    // const endpoint = 'http://localhost:5601/upload/video';
    // const endpoint = 'http://122.155.223.63/td-doc/uploadVideo';
    // const endpoint = 'http://122.155.223.147/document/uploadVideo';
    //const endpoint = 'https://lineoa.we-builds.com/lineoa-document/upload/video';
    const endpoint = 'https://line-ddpm.we-builds.com/document/upload/video';
    const formData: FormData = new FormData();
    formData.append('Video', fileToUpload, fileToUpload.name);
    formData.append('VideoCaption', caption);
    return this.http.post(endpoint, formData);
  }


  get() {
    return this.http.get('http://kascoit.ddns.me:99/publish/api/Product');
  }

  post() {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    // let options = new RequestOptions();
    // options.headers = headers;
    return this.http.post('https://localhost:5001/upload/post', {}, { headers: headers });
  }

  postFileBuffer(caption: string, fileToUpload: File) {
    const endpoint = 'https://localhost:5001/upload';
    // const endpoint = 'http://122.155.223.63/td-doc/upload';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('ImageCaption', caption);
    return this.http.post(endpoint, formData, {
      responseType: "arraybuffer"
    });
  }

}
