import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cinum',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css']
})
export class InputNumberComponent implements OnInit {

  @Input() label;
  @Input() data = 0;
  @Output() cModel = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param);
  }


}
