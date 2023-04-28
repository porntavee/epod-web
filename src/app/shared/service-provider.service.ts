import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  // ng build --base-href "/epod/" --prod
  // ng build --base-href "/epod/" --prod --aot --output-hashing=all
  // ng build --prod --aot --output-hashing=all

  //server: string = 'http://202.44.230.195/sino-api/';
  server: string = 'http://202.44.230.195/test-sino-api/';

  version: string = '2023.04.2701';

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
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(basicAuth)
      })
    };

    // let options = new RequestOptions();
    // options.headers = headers;
    param.Version = this.version;
    return this.http.post(this.server + url, param, httpOptions);
  }

  postNotification(param) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAACBsG56o:APA91bH-fONe0uBoEfb5QzlNEoNl7cfeIm9XYeJHUl1RC1DpxMWVJw5rwQp0cML04Tp6iRRY6D3FWescVMqzl3_kVmlXWZ7B_biAET83YDeEg3azHssGY-KsG-x-v0jZlekl_ZTbxhIJ'
      })
    };

    let body = {
      "to": "/topics/all",
      "notification": {
        "android_channel_id": "high_importance_channel",
        "body": "แจ้งเตือนอนุมัติงาน",
        "title": "ใบคุม " + param + " ได้อนุมัติงานแล้ว!!"
      },
      "data": {
        "body": "Body of Your Notification in Data",
        "title": "Title of Your Notification in Title",
        "key_1": "Value for key_1",
        "key_2": "Value for key_2",
        "click_action": "FLUTTER_NOTIFICATION_CLICK"
      },
      "content_available": true,
      "priority": "high",
      "chanel_id": "webuild"
    };

    return this.http.post('https://fcm.googleapis.com/fcm/send', body, httpOptions);
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
