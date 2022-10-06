import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'cdp',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() label;
  @Input() data = '';
  @Input() dateControl = new FormControl(moment().format('YYYYMMDD'));
  @Output() cModel = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {

    if (this.data == undefined || this.data == '')
      this.data = ''; //this.dateControl.value;

    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(moment(param).format('YYYYMMDD') || '');
  }

}
