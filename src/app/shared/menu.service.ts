import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu: any = []
  category: any = {};
  groupCode: string = '';

  constructor() {
    if (localStorage.getItem('token_epod_20221006') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
    }
    
    // console.log('groupCode', this.groupCode);
    console.log('category', this.category);

    this.menu = [];
    this.menu = [{
      name: 'งานขนส่ง',
      // isActive: true,
      items: [
        { 'name': 'อนุมัติงาน', 'routing': '/order-approve', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.orderApprove }, //this.category?.orderApprove
        { 'name': 'งานขนส่ง', 'routing': '/order', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.order },
        { 'name': 'ใบคุมรถ', 'routing': '/order-transport', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.orderTransport },
        { 'name': 'รับสินค้าเข้า HUB', 'routing': '/return-hub', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.returnHub },
        { 'name': 'คืนเอกสาร', 'routing': '/return-document', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.returnDocument },
        { 'name': 'รายการคืนเอกสาร', 'routing': '/return-transaction', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.returnTransaction },
        { 'name': 'ติดตามสถานะ', 'routing': '/tracking-status', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.trackingStatus },
        { 'name': 'ติดตามสถานะ', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
        { 'name': 'นำเข้าคำสั่งส่ง', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false }
      ]
    },
    {
      name: 'ทะเบียน',
      items: [
        { 'name': 'ผู้ใช้งาน', 'routing': '/master-user', 'data': '', 'type': 'N', 'isActive': false, 'isShow':  this.category?.masterUser },
        { 'name': 'สถานที่รับ/ส่งสินค้า', 'routing': '/master-shiplocation', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterShiplocation},
        { 'name': 'ภูมิภาค / Country', 'routing': '/master-country', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterCountry },
        { 'name': 'เส้นทางหลัก / Route', 'routing': '/master-route', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterRoute },
        { 'name': 'เส้นทางย่อย / SubRoute', 'routing': '/master-subroute', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterSubRoute },
        { 'name': 'โซน', 'routing': '/master-zoneregion', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterZoneregion },
        { 'name': 'ทะเบียนรถ', 'routing': '/master-vehicle', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterVehicle },
        { 'name': 'บริษัทขนส่ง', 'routing': '/master-transport', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterTransport },
        { 'name': 'วันหยุด', 'routing': '/master-holiday', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.masterHoliday }
      ]
    },
    {
      name: 'รายงาน',
      items: [
        { 'name': 'Dashboard', 'routing': '/dashboard', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.dashboard },
        { 'name': 'Transport Manifest Report', 'routing': '/transport-manifest-report', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.transportManifestReport },
        { 'name': 'Summary Report', 'routing': '/summary-report', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.summaryReport },
        { 'name': 'Customer Report', 'routing': '/customer-report', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.customerReport }
      ]
    },
    {
      name: 'คืนเอกสาร',
      items: [
        { 'name': 'คืนเอกสาร', 'routing': '/line-message-text-form', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
      ]
    }];
  }

  clearActive() {
    this.menu.forEach(c => {
      c.items.forEach(cc => {
        cc.isActive = false;
      })
    });
  }
}
