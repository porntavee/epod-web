import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu: any = []
  category: any = {
    userRolePage: false,
    memberMobilePage: false,
    memberMobileNotConfirmPage: false,
    setAnswerQuestionsPage: false,
    questionsFromUsersPage: false,
    timelinePage: false,
    notifyMembersPage: false,
    sendNewMemberPage: false,
    sendMessageMemberPage: false,
    frequentlyQuestionsAndAnswersPage: false,
    replyChatMembersPage: false,
    autoReplyPage: false,
  };


  constructor() {
    if (localStorage.getItem('token_epod_20221006') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
    }
    this.menu = [
      {
        name: 'งานขนส่ง',
        // isActive: true,
        items: [
          { 'name': 'อนุมัติงาน', 'routing': '/order-approve', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true }, //this.category?.orderApprove
          { 'name': 'สร้างงานขนส่ง', 'routing': '/order', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'สร้างใบคุมรถ', 'routing': '/order-transport', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'คืนเอกสาร', 'routing': '/return-document', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'รายการคืนเอกสาร', 'routing': '/return-transaction', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'ติดตามสถานะ', 'routing': '/tracking-status', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'ติดตามสถานะ', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
          { 'name': 'นำเข้าคำสั่งส่ง', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
        ]
      },
      {
        name: 'ทะเบียน',
        items: [
          { 'name': 'สถานที่รับ/ส่งสินค้า', 'routing': '/master-shiplocation', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'เส้นทางหลัก / Route', 'routing': '/master-route', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'เส้นทางย่อย / SubRoute', 'routing': '/master-subroute', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'ผู้ใช้งาน', 'routing': '/master-user', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'วันหยุด', 'routing': '/auto-reply', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false }
        ]
      },
      {
        name: 'รายงาน',
        items: [
          { 'name': 'Dashboard', 'routing': '/news', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
          { 'name': 'Report A', 'routing': '/warning', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
          { 'name': 'Report B', 'routing': '/knowledge', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
          { 'name': 'Report C', 'routing': '/knowledge-tool', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
        ]
      },
      {
        name: 'คืนเอกสาร',
        items: [
          { 'name': 'คืนเอกสาร', 'routing': '/line-message-text-form', 'data': '', 'type': 'N', 'isActive': false, 'isShow': false },
        ]
      },
    ];
  }


  clearActive() {
    this.menu.forEach(c => {
      c.items.forEach(cc => {
        cc.isActive = false;
      })
    });
  }
}
