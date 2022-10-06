import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'csw',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {

  @Input() label;
  @Input() data = false;
  @Output() cModel = new EventEmitter<boolean>();

  @Input() iaLabel;
  @Input() aLabel;

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param.checked);
  }

}
