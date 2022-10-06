import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cbtne',
  templateUrl: './button-edit.component.html',
  styleUrls: ['./button-edit.component.css']
})
export class ButtonEditComponent implements OnInit {

  @Input() label;

  constructor() { }

  ngOnInit(): void {
  }

}
