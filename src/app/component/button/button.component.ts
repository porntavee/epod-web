import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbtn',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  @Input() label;
  @Input() position: string = '';
  @Input() color: string = '';
  @Input() icon: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
