import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffer, KeyValueDiffers, KeyValueChanges } from '@angular/core';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MatAccordionDisplayMode } from '@angular/material/expansion';

@Component({
  selector: 'app-news-criteria',
  templateUrl: './news-criteria.component.html',
  styleUrls: ['./news-criteria.component.css']
})
export class NewsCriteriaComponent implements OnInit {

  @Input() displayMode: MatAccordionDisplayMode
  @Input() hideToggle: boolean
  @Input() typeMessage: String
  @Input() criteriaModel: any = {};;
  @Output() messageToEmit = new EventEmitter<any>();
  @Output() messageTagsAndRegions = new EventEmitter<any>();
  isAdvanceSearch: boolean = true;
  tagsAndRegions: any = [];
  listSequence: any = [];
  listCategory: any = [{ value: '', display: 'ทั้งหมด' }];
  regionList: any = [];
  listTag: any = [];
  listTags: any = [];
  permission: any;
  @Input() paginationModel: any = {}; // <----- Pagination
  paginationModelDiffer: KeyValueDiffer<string, any>; // <----- Pagination

  // @Input() title;
  // @Input() description;
  // @Input() isActive;


  public dateTimeControl = new FormControl(moment());
  public dateControl = new FormControl(moment());

  listEmployeeCode: any = [];
  listFirstName: any = [];

  constructor(private serviceProviderService: ServiceProviderService, private spinner: NgxSpinnerService, private toastr: ToastrService, private differs: KeyValueDiffers) { }

  ngOnInit(): void {

    this.listEmployeeCode = [{ value: '', display: '----- Select -----' }, 
    { value: 'TH00641001026', display: 'TH00641001026' }, 
    { value: 'TH00641001027', display: 'TH00641001027' }, 
    { value: 'TH00641001028', display: 'TH00641001028' }];
    this.listFirstName = [{ value: '', display: '----- Select -----' }, 
    { value: '1', display: 'First Name' },
    { value: '2', display: 'First Name' },
    { value: '3', display: 'First Name' }];

    if (localStorage.getItem('newsPage') != null) {
      let model: any = [];
      model = JSON.parse(localStorage.getItem('newsPage'));

      for (let index = 0; index < model.length; index++) {
        if (index == 0)
          this.permission = model[index].title;
        else
          this.permission = this.permission + "," + model[index].title;
      }
    }

    this.regionList = [{ display: "ภาคเหนือ", value: false },
    { display: "ภาคกลาง", value: false },
    { display: "ภาคใต้", value: false },
    { display: "ภาคอีสาน", value: false }
    ];

    this.readTags();
    this.readCategory();
    this.readSequence();
    this.search()

    this.paginationModelDiffer = this.differs.find(this.paginationModel).create(); // <----- Pagination
  }

  search() {
    // this.spinner.show();
    // console.log('--------- search -------',this.criteriaModel);
    this.messageToEmit.emit(this.criteriaModel); // <----- Pagination
  }

  readSequence() {
    this.criteriaModel.permission = this.permission;
    this.serviceProviderService.post('groupby/read', { permission: this.permission, title: 'news' }).subscribe(data => {
      let model: any = {};
      model = data;
      this.listSequence = model.objectData;
      this.listSequence.splice(0, 0, { value: '', display: 'ทั้งหมด' });
    }, err => { });
  }

  readTags() {
    this.serviceProviderService.postByPass('LineTag/read', {}).subscribe(data => {
      let model: any = {};
      model = data;
      model.objectData.forEach(element => {
        this.listTag.push({ value: element.code, display: element.title,checkTag:false });
      });
      this.listTags = this.listTag;
    }, err => { });

  }

  selectedTags(param) {
    this.tagsAndRegions.listTag = param;
    // console.log('--------- callback -------',param);
    this.messageTagsAndRegions.emit(this.tagsAndRegions);
  }

  readCategory() {

    this.criteriaModel.permission = this.permission;
    this.serviceProviderService.post('news/category/read', this.criteriaModel).subscribe(data => {
      let model: any = {};
      model = data;
      this.listCategory = [{ value: '', display: 'ทั้งหมด' }];
      model.objectData.forEach(element => {
        this.listCategory.push({ value: element.code, display: element.title });
      });
    }, err => { });
  }

  setSelectedRegion(index, event) {
    let temp = [];
    this.tagsAndRegions.region = '';
    this.regionList[index].value = event;
    this.regionList.forEach(e => {
      if (e.value)
        temp.push(e.display);
    });
    this.tagsAndRegions.regions = temp;
    this.messageTagsAndRegions.emit(this.tagsAndRegions);
    // this.modelLineCriteria.emit(this.searchModel);
  }

  // checkbox tags
  Change(data, ischeckTag) {
    if (ischeckTag != undefined || ischeckTag != '') {
      this.listTag.map(function (val, index) {
        if (val.value == data.value)
          return val.checkTag = ischeckTag;
      });
      this.tagsAndRegions.listTag = this.listTag;
    this.messageTagsAndRegions.emit(this.tagsAndRegions); // <----- Pagination
    // this.modelLineCriteria.emit(this.editModel);
    }
  }

  advance() {
    this.isAdvanceSearch = !this.isAdvanceSearch;
    this.criteriaModel.keySearch = '';
  }

  displayDate(param) {
    return moment(param).format('YYYYMMDD');
  }

  displayDateTime(param) {
    return moment(param).format('YYYYMMDDhhmmss');
  }

  reset() {

    this.criteriaModel.title = '';
    this.criteriaModel.sequence = '';
    this.criteriaModel.category = '';
    this.criteriaModel.startDate = '';
    this.criteriaModel.endDate = '';
    this.criteriaModel.status = '';
    this.criteriaModel.createBy = '';

    // this.read();
  }

}
