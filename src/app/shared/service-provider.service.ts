import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  // ng build --base-href "/epod/" --prod
  // ng build --base-href "/epod/" --prod --aot --output-hashing=all

  // server: string = 'https://mangcoo.com/sino-api/';
  server: string = 'http://202.44.230.195/sino-api/';
  
  version: string = '20221102';

  userinformation: any = {
    "UserId": localStorage.getItem('token_epod_20221006') ?? '',
    "UserName": localStorage.getItem('userName') ?? '',
    "GroupCode": localStorage.getItem('groupCode') ?? '',
    "dbName": "WTX-EPOD",
    "Version": "22.11.01.01",
  };

  constructor(private http: HttpClient) { }

  get(url) {
    return this.http.get(this.server + url);
  }

  post(url, param) {
    const basicAuth = 'dhong:dhong@whaletechx';

    // let headers = new HttpHeaders();
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization',  'Basic ' + btoa(basicAuth));

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(basicAuth)
      })
    };

    // let options = new RequestOptions();
    // options.headers = headers;
    param.Version = this.version;
    return this.http.post(this.server + url, param, httpOptions);
  }

  postByPass(url, param) {

    // let server = 'https://localhost:5001/';
    // let server = 'http://122.155.223.63/td-ddpm-api/';

    if (localStorage.getItem('username') != null) {
      param.imageUrlCreateBy = localStorage.getItem('imageUrl');
      param.createBy = localStorage.getItem('username');
      param.updateBy = localStorage.getItem('username');
    }

    // if (localStorage.getItem('category') != null) {
    //   let model = JSON.parse(localStorage.getItem('category'));
    //   param.lv0 = model.lv0;
    //   param.lv1 = model.lv1;
    //   param.lv2 = model.lv2;
    //   param.lv3 = model.lv3;
    // }

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    // let options = new RequestOptions();
    // options.headers = headers;
    return this.http.post(this.server + url, param, { headers: headers });
  }

  postLineAuth(url, param) {

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post('https://api.line.me/oauth2/v2.1/token', param);
  }

  postManual(url, param) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    // let options = new RequestOptions();
    // options.headers = headers;
    param.organization = [];
    param.permission = 'all';
    return this.http.post(url, param, { headers: headers });
  }

}
