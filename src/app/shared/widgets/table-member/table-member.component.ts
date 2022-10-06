//line-member

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-table-member',
  templateUrl: './table-member.component.html',
  styleUrls: ['./table-member.component.css']
})
export class TableMemberComponent implements OnInit {
  appService: any = '';
  criteriaModel: any = {
    startDate: '',
    endDate: '',
    status: '',
    keySearch: ''
  };
  isAdvanceSearch: boolean = false;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() model: any;
  @Output() callBack = new EventEmitter<any>();

  isShowImage: boolean = false;
  pageList = [
    { value: '5', display: '5' },
    { value: '10', display: '10' },
    { value: '50', display: '50' },
    { value: '100', display: '100' }
  ];
  searchModel: any = { tags: [] };
  @Input() paginationModel: any = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    itemsPerPageString: '10'
  };
  itemSelected: boolean = false;
  isManageTag: boolean = false;
  tagList: any = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  selectedAll() {
    if (this.itemSelected)
      this.model.forEach(element => {
        element.isSelected = true;
      });
    else
      this.model.forEach(element => {
        element.isSelected = false;
      });
  }

  selected() {

    let isExist = this.model.filter(c => !c.isSelected);

    if (isExist.length > 0)
      this.itemSelected = false;
    else
      this.itemSelected = true;
  }

  reset() {
    this.searchModel.startDate = '';
    this.searchModel.endDate = '';
    this.searchModel.status = '';
    this.searchModel.username = '';
    this.searchModel.firstName = '';
    this.searchModel.lastName = '';
    this.searchModel.tags = [];
  }

  selectedTags(param) {
    this.searchModel.tags = param;
  }
}
