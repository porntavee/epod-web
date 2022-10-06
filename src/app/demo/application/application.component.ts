import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})

export class ApplicationComponent implements OnInit {
  model: any = [];
  listModel: string = '';
  criteriaHide: boolean = false;
  listHide: boolean = false;
  viewHide: boolean = true;
  editHide: boolean = true;
  constructor() {

  }

  ngOnInit(): void {
  }

  receivedChildMessage: string;
  getMessageCriteria(message: any) {
    this.model = message;
    this.listModel = this.model;
  }

  getMessageList(message: any) {
  
    if (message.mode == 'view')
    {
      this.criteriaHide = true;
      this.listHide = true;
      this.viewHide = false;
    }
    else if (message.mode == 'edit')
    {
      this.criteriaHide = true;
      this.listHide = true;
      this.editHide = false;
    }
  }
}
