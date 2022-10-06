import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'cmsop',
  templateUrl: './multi-selected-option.component.html',
  styleUrls: ['./multi-selected-option.component.css']
})
export class MultiSelectedOptionComponent implements OnInit {

  @Input() label;
  @Input() data: any;
  @Output() cModel = new EventEmitter<string>();
  @Input() sources: any = [];

  constructor() { }

  ngOnInit(): void {
    this.cModel.emit(this.data || '');
  }

  emit(param) {
    this.cModel.emit(param);
  }

  setValue() {
    this.data = '';
  }

}
