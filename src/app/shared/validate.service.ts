import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(private toastr: ToastrService) { }

  isValidateCreate(param) {

    let isValid = false;
    if (param.title == '') {
      this.toastr.warning('กรุณาใส่หัวข้อ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      isValid = true;
    }

    if (param.image.length == 0) {
      this.toastr.warning('กรุณาใส่รูปภาพ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      isValid = true;
    }

    if (param.category == '') {
      this.toastr.warning('กรุณาเลือกหมวดหมู่', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      isValid = true;
    }

    return isValid;
  }

  isValidateUpdate(param) {

    let isValid = false;
    if (param.title == '') {
      this.toastr.warning('กรุณาใส่หัวข้อ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      isValid = true;
    }

    if (param.image != undefined)
    {
      if (param.image.length == 0 ) {
        this.toastr.warning('กรุณาใส่รูปภาพ', 'แจ้งเตือนระบบ', { timeOut: 1000 });
        isValid = true;
      }  
    }
    
    if (param.category == '') {
      this.toastr.warning('กรุณาเลือกหมวดหมู่', 'แจ้งเตือนระบบ', { timeOut: 1000 });
      isValid = true;
    }

    return isValid;
  }
}
