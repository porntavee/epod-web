import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CallService {
    createBy: string = 'admin';
    updateBy: string = 'admin';
    prefixName: string = 'Mr';
    position: string = 'super admin';
    level: string = 'vip';
    birthDay: string = '19950230';
    expirationDate: string = '20200530';

    baseUrl: string = '';
    constructor(private http: HttpClient) { }
    postData = (url: string, data: any, ) => {
        // this.baseUrl = 'https://localhost:5001/';
        this.baseUrl = 'http://122.155.223.63/td-web-api/'
        let headers = new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        let options = { headers: headers }
        const endpoint = this.baseUrl + url;
        return this.http.post(endpoint, data, options);
    }

    uploadImage = (data: any) => {
        let headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        let options = { headers: headers };
        // this.baseUrl = 'https://localhost:5004/api/UploadImage/UploadImage'
        this.baseUrl = 'http://122.155.223.63/td-doc/upload';
        const endpoint = this.baseUrl;
        return this.http.post(endpoint, data, options);
    }

}
