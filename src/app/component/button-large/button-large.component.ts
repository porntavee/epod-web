import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbtnl',
  templateUrl: './button-large.component.html',
  styleUrls: ['./button-large.component.css']
})
export class ButtonLargeComponent implements OnInit {

  @Input() label;
  @Input() position: string = '';
  @Input() color: string = '';
  @Input() icon: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
