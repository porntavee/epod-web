import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  category: any = {};
  organization: any = [];

  constructor() {

    if (localStorage.getItem('category') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
      this.organization = JSON.parse(localStorage.getItem('organization'));
    }

  }

  filterSelected(editModel, lv0Category, lv1Category, lv2Category, lv3Category, lv4Category) {

    if (editModel.organization == 'auto') {
      editModel.organizationMode = 'auto'; // <----- ไปจัดการบน Service แทน
    }
    else {
      if (lv0Category.filter(c => c.check).length > 0) // <----- Organization
      {
        let model = lv0Category.filter(c => c.check);
        let lv = '';
        for (let index = 0; index < model.length; index++) {
          if (index == 0) {
            lv = model[index].code;
          }
          else {
            lv = lv + ',' + model[index].code;
          }
        }

        editModel.lv0 = lv;
      }
      else {
        editModel.lv0 = '';
      }

      if (lv1Category.filter(c => c.check).length > 0) // <----- Organization
      {
        let model = lv1Category.filter(c => c.check);
        let lv = '';
        for (let index = 0; index < model.length; index++) {
          if (index == 0) {
            lv = model[index].code;
          }
          else {
            lv = lv + ',' + model[index].code;
          }
        }

        if (lv0Category.length == 0)
          editModel.lv0 = this.category.lv0;

        editModel.lv1 = lv;
      }
      else {
        editModel.lv1 = '';
      }

      if (lv2Category.filter(c => c.check).length > 0) // <----- Organization
      {
        let model = lv2Category.filter(c => c.check);
        let lv = '';
        for (let index = 0; index < model.length; index++) {
          if (index == 0) {
            lv = model[index].code;
          }
          else {
            lv = lv + ',' + model[index].code;
          }
        }

        if (lv0Category.length == 0)
          editModel.lv0 = this.category.lv0;
        if (lv1Category.length == 0)
          editModel.lv1 = this.category.lv1;

        editModel.lv2 = lv;
      }
      else {
        editModel.lv2 = '';
      }

      if (lv3Category.filter(c => c.check).length > 0) // <----- Organization
      {
        let model = lv3Category.filter(c => c.check);
        let lv = '';
        for (let index = 0; index < model.length; index++) {
          if (index == 0) {
            lv = model[index].code;
          }
          else {
            lv = lv + ',' + model[index].code;
          }
        }

        if (lv0Category.length == 0)
          editModel.lv0 = this.category.lv0;
        if (lv1Category.length == 0)
          editModel.lv1 = this.category.lv1;
        if (lv2Category.length == 0)
          editModel.lv2 = this.category.lv2;

        editModel.lv3 = lv;
      }
      else {
        editModel.lv3 = '';
      }

      if (lv4Category.filter(c => c.check).length > 0) // <----- Organization
      {
        let model = lv4Category.filter(c => c.check);
        let lv = '';
        for (let index = 0; index < model.length; index++) {
          if (index == 0) {
            lv = model[index].code;
          }
          else {
            lv = lv + ',' + model[index].code;
          }
        }

        if (lv0Category.length == 0)
          editModel.lv0 = this.category.lv0;
        if (lv1Category.length == 0)
          editModel.lv1 = this.category.lv1;
        if (lv2Category.length == 0)
          editModel.lv2 = this.category.lv2;
        if (lv3Category.length == 0)
          editModel.lv3 = this.category.lv3;

        editModel.lv4 = lv;
      }
      else {
        editModel.lv4 = '';
      }
    }

    return editModel;

  }
}
