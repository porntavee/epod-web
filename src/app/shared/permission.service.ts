import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  readPermission(param) {
    if (localStorage.getItem(param) != null) {
      let model: any = [];
      model = JSON.parse(localStorage.getItem(param));

      let permission = '';

      for (let index = 0; index < model.length; index++) {
        if (index == 0)
          permission = model[index].title;
        else
          permission = permission + "," + model[index].title;
      }

      return permission;
    }
    else
    {
      return '';
    }
  }

  readLocalStorage(param) {
    if (localStorage.getItem(param) != null) {
      return JSON.parse(localStorage.getItem(param));
    }
    else {
      return '';
    }
  }
}
