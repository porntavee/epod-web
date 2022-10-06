import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'citxt',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements OnInit {

  @Input() label;
  @Input() data = '';
  @Output() cModel = new EventEmitter<string>();
  
  @Input() readonly = false;
  @Input() type = 'text';

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param);
  }

}
