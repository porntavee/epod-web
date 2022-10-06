import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'cdtp',
  templateUrl: './custom-datetimepicker.component.html',
  styleUrls: ['./custom-datetimepicker.component.css']
})
export class CustomDatetimepickerComponent implements OnInit {

  @Input() label;
  @Input() data = '';
  @Input() dateControl = new FormControl(moment().format('YYYYMMDD HHmmss'));
  @Output() cModel = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    if (this.data == undefined || this.data == '')
    {
      this.data = ''; //this.dateControl.value;
    }
    else
    {
      let date = this.data.substring(0, 8); 
      let time = this.data.substring(8, 14);
      this.data = date + ' ' + time;
    }
      
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(moment(param).format('YYYYMMDDHHmmss'));
  }

}
