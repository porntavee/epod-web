import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'citxtb',
  templateUrl: './input-text-border.component.html',
  styleUrls: ['./input-text-border.component.css']
})
export class InputTextBorderComponent implements OnInit {

  @Input() label;
  @Input() data = '';
  @Output() cModel = new EventEmitter<string>();

  @Input() readonly: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param);
  }

}
