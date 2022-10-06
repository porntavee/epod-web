import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() receivedParentMessage: any = [];
  @Output() messageToEmit = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  view(param) {
    let model = {
      data: param,
      mode: 'view'
    }
    this.messageToEmit.emit(model);
  }

  edit(param) {
    let model = {
      data: param,
      mode: 'edit'
    }
    this.messageToEmit.emit(model);
  }

}
