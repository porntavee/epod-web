import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  // ng build --base-href "/pm/" --prod
  // ng build --base-href "/pm/" --prod --aot --output-hashing=all

  server: string = 'https://pm.we-builds.com/pm-api/';
  
  version: string = '20190921.1';

  constructor(private http: HttpClient) { }

  get(url) {
    return this.http.get(this.server + url);
  }

  post(url, param) {

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    // let options = new RequestOptions();
    // options.headers = headers;
    param.Version = this.version;
    return this.http.post(this.server + url, param, { headers: headers });
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
