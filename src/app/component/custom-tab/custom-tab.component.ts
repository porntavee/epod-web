import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ctab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.css']
})
export class CustomTabComponent implements OnInit {

  @Input() data = 0;

  constructor() { }

  ngOnInit(): void {
    // this.selectedIndex = 2;
  }

}
