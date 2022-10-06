import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.css']
})

export class SelectOptionComponent implements OnInit {

  check: any;

  constructor() {
  }

  ngOnInit() {
    
  }

  setValue() {
    this.check = 'B';
  }

}
