//line-member

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ServiceProviderService } from '../../service-provider.service';

@Component({
  selector: 'chip-tag',
  templateUrl: './chip-tag.component.html',
  styleUrls: ['./chip-tag.component.css']
})
export class ChipTagComponent implements OnInit {
  appService: any = '';

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: any[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Input() model: any;
  @Output() callBack = new EventEmitter<any>();

  tagList: any = [];
  selectedList: any[] = [];
  selectedCodeList: any[] = [];

  constructor(private serviceProviderService: ServiceProviderService) {
    console.log('this.tagCtrl === ', this.tagCtrl);

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(),
      map((tag: string | null) => tag ? this._filter(tag) : this.tagList.slice()));
  }

  ngOnInit(): void {
    this.readTag();
  }

  triggerTag() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.tagList.slice()));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.tagList.forEach(c => {
      if (c.display == value)
        this.selectedList.push(c);
    });
    // // Add our tag
    // if (inputTag != null) {
    //   this.selectedList.push(inputTag[0]);
    // }

    // Clear the input value
    this.tagInput.nativeElement.value = '';

    this.tagCtrl.setValue(null);
    this.setCode();
  }

  remove(tag: string): void {
    const index = this.selectedList.indexOf(tag);

    if (index >= 0) {
      this.selectedList.splice(index, 1);
    }
    this.setCode();
  }

  async setCode() {
    //   this.selectedCodeList = [];
    //  await this.selectedList.forEach(c => {
    //    this.selectedCodeList.push(this.tagList.find(o => {
    //     if(o.display == c)
    //       return o.value;
    //    }));
    //   })
    console.log('this.selectedList ---------- ', this.selectedList);

    this.callBack.emit(this.selectedList);
  }

  selectedChip(event: MatAutocompleteSelectedEvent): void {
    this.selectedList.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.setCode();
    this.triggerTag();
  }

  private _filter(value: string): string[] {
    var filterValue = "";
    if (value['display'])
      filterValue = value['display'].toLowerCase();
    else
      filterValue = value.toLowerCase();
    // const filterValue = value.toLowerCase();

    return this.tagList.filter(tag => tag.display.toLowerCase().indexOf(filterValue) === 0);
  }

  readTag() {

    this.serviceProviderService.post(this.appService.read, {}).subscribe(data => {
      let model: any = {};
      model = data;

      model.objectData.forEach(element => {
        this.tagList.push({ value: element.code, display: element.title });
        this.allTags.push(element.title);
      });

    }, err => {
    });
  }

}
