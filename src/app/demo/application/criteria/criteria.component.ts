import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})


export class CriteriaComponent implements OnInit {
  @Input() firstname;
  @Input() lastname;
  @Input() check;
  @Output() messageToEmit = new EventEmitter<any>();
  public dateTimeControl = new FormControl(moment());
  public dateControl = new FormControl(moment());
  constructor(private spinner: NgxSpinnerService) {
    
  }

  ngOnInit(): void {
    // let model = [
    //   {
    //     firstname: 'Apple',
    //     lastname: 'Ltd.co'
    //   },
    //   {
    //     firstname: 'Sumsung',
    //     lastname: 'Ltd.co'
    //   }
    // ];
    // this.messageToEmit.emit(model);
  }

  search() {
    let model = [
      {
        firstname: 'Apple',
        lastname: 'Ltd.co',
        check: this.check
      },
      {
        firstname: 'Sumsung',
        lastname: 'Ltd.co',
        check: this.check
      }
    ];
    
    this.spinner.show("mySpinner3", {
      type: "ball-8bits",
      size: "medium",
      bdColor: "#333",
      color: "#fff",
      fullScreen: true
    });

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide("mySpinner3");
      this.messageToEmit.emit(model);
    }, 500);
    
  }

  displayDate(param) {
    return moment(param).format('YYYYMMDD');
  }
  
  displayDateTime(param) {
    return moment(param).format('YYYYMMDDhhmmss');
  }
  // onChanges(newValue) {
  //   this.messageToEmit.emit(newValue);
  // }

}
