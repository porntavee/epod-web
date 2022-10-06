//line-member

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-group-member',
  templateUrl: './form-group-member.component.html',
  styleUrls: ['./form-group-member.component.css']
})
export class FormGroupMemberComponent implements OnInit {

  @Input() model: any;
  @Input() dynamicField: any;
  @Output() callBack = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
   
  }

}
