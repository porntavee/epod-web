import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ctxta',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {

  @Input() label;
  @Input() data = '';
  @Output() cModel = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data);
  }

  emit(param) {
    this.cModel.emit(param);
  }

}
