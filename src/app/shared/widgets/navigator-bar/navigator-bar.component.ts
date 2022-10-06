import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigator-bar',
  templateUrl: './navigator-bar.component.html',
  styleUrls: ['./navigator-bar.component.css']
})
export class NavigatorBarComponent implements OnInit {

  @Input() title1: string = 'สมาชิกทั้งหมด';
  @Input() title2: string = 'ระบบจัดการสมาชิก';
  @Input() title3: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
