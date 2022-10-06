import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  showSpinner() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  showSpinner2() {
    this.spinner.show("mySpinner2", {
      type: "line-scale-party",
      size: "large",
      bdColor: "rgba(100,149,237, .8)",
      color: "white"
    });

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide("mySpinner2");
    }, 500);
  }

  showSpinner3() {
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
    }, 500);
  }

  showSpinner4() {
    this.spinner.show("mySpinner4", {
      type: "ball-8bits",
      size: "default",
      bdColor: "#333",
      color: "#fff",
      fullScreen: false
    });

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide("mySpinner4");
    }, 500);
  }

}
