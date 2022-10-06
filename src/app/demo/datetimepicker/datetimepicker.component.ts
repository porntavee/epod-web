import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.css']
})
export class DatetimepickerComponent implements OnInit {
  dateValue: Date = new Date("05/16/2017 5:00 AM");
  dateValue2: Date = new Date("05/17/2017");
  // dateControl = new FormControl(moment());

  @ViewChild('picker') picker: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public disableSecond = true;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(moment());

  constructor() { 

     let x = moment(this.dateValue).format('YYYYMMDD');

  }
 
  ngOnInit(): void {
    this.date = null;
  }

  closePicker(){
    this.picker.cancel();
  }
}
