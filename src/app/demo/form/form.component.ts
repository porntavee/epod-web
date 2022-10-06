import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  model: any = {};
  mySubscription: any;
  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  formatDate(param) {

    // debugger
    // if (param != undefined)
    // {
    //   var reTime = /(\d+\-\d+\-\d+)\D\:(\d+\:\d+\:\d+).+/;
    //   var originalTime = '2016-01-17T:08:44:29+0100';
    //   originalTime = param.ToString();
    //   var newTime = originalTime.replace(reTime, '$1 $2');
    //   // console.log('newTime:', newTime);
    //   return newTime;
    // }
    // else
    //   return '';

  }

}
