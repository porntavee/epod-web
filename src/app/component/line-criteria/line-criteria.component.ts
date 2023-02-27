import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DateFormatPipe } from 'src/app/date-format.pipe';
import { DatetimeFormatPipe } from 'src/app/datetime-format.pipe';
import { ExcelService } from 'src/app/shared/excel.service';
import { ServiceProviderService } from 'src/app/shared/service-provider.service';

@Component({
  selector: 'app-line-criteria',
  templateUrl: './line-criteria.component.html',
  styleUrls: ['./line-criteria.component.css']
})
export class LineCriteriaComponent implements OnInit {
  @Output() modelLineCriteria = new EventEmitter<any>();

  constructor(private serviceProviderService: ServiceProviderService,
    private excelService: ExcelService,
    private toastr: ToastrService,) { }
  editModel: any = {};
  listTag: any = [];
  listTags: any = [];
  regionList: any = [];
  listProvince: any = [
    //_North
    { value: "เชียงราย", display: "เชียงราย" },
    { value: "เชียงใหม่", display: "เชียงใหม่" },
    { value: "น่าน", display: "น่าน" },
    { value: "พะเยา", display: "พะเยา" },
    { value: "แพร่", display: "แพร่" },
    { value: "แม่ฮ่องสอน", display: "แม่ฮ่องสอน" },
    { value: "ลำปาง", display: "ลำปาง" },
    { value: "ลำพูน", display: "ลำพูน" },
    { value: "อุตรดิตถ์", display: "อุตรดิตถ์" },
    { value: "พิษณุโลก", display: "พิษณุโลก" },
    { value: "สุโขทัย", display: "สุโขทัย" },
    { value: "ตาก", display: "ตาก" },
    { value: "กำแพงเพชร", display: "กำแพงเพชร" },
    { value: "นครสวรรค์", display: "นครสวรรค์" },
    { value: "พิจิตร", display: "พิจิตร" },
    //_Eastern
    { value: "กาฬสินธุ์", display: "กาฬสินธุ์" },
    { value: "ขอนแก่น", display: "ขอนแก่น" },
    { value: "ชัยภูมิ", display: "ชัยภูมิ" },
    { value: "นครพนม", display: "นครพนม" },
    { value: "นครราชสีมา", display: "นครราชสีมา" },
    { value: "บึงกาฬ", display: "บึงกาฬ" },
    { value: "บุรีรัมย์", display: "บุรีรัมย์" },
    { value: "มหาสารคาม", display: "มหาสารคาม" },
    { value: "มุกดาหาร", display: "มุกดาหาร" },
    { value: "ยโสธร", display: "ยโสธร" },
    { value: "ร้อยเอ็ด", display: "ร้อยเอ็ด" },
    { value: "เลย", display: "เลย" },
    { value: "ศรีสะเกษ", display: "ศรีสะเกษ" },
    { value: "สกลนคร", display: "สกลนคร" },
    { value: "สุรินทร์", display: "สุรินทร์" },
    { value: "หนองคาย", display: "หนองคาย" },
    { value: "หนองบัวลำภู", display: "หนองบัวลำภู" },
    { value: "อำนาจเจริญ", display: "อำนาจเจริญ" },
    { value: "อุดรธานี", display: "อุดรธานี" },
    { value: "อุบลราชธานี", display: "อุบลราชธานี" },
    { value: "เพชรบูรณ์", display: "เพชรบูรณ์" },
    //_Central
    { value: "อุทัยธานี", display: "อุทัยธานี" },
    { value: "ชัยนาท", display: "ชัยนาท" },
    { value: "สิงห์บุรี", display: "สิงห์บุรี" },
    { value: "อ่างทอง", display: "อ่างทอง" },
    { value: "พระนครศรีอยุธยา", display: "พระนครศรีอยุธยา" },
    { value: "ลพบุรี", display: "ลพบุรี" },
    { value: "สระบุรี", display: "สระบุรี" },
    { value: "นครนายก", display: "นครนายก" },
    { value: "ปราจีนบุรี", display: "ปราจีนบุรี" },
    { value: "สระแก้ว", display: "สระแก้ว" },
    { value: "ฉะเชิงเทรา", display: "ฉะเชิงเทรา" },
    { value: "ชลบุรี", display: "ชลบุรี" },
    { value: "ระยอง", display: "ระยอง" },
    { value: "จันทบุรี", display: "จันทบุรี" },
    { value: "ตราด", display: "ตราด" },
    { value: "กรุงเทพมหานคร", display: "กรุงเทพมหานคร" },
    { value: "นนทบุรี", display: "นนทบุรี" },
    { value: "ปทุมธานี", display: "ปทุมธานี" },
    { value: "สมุทรปราการ", display: "สมุทรปราการ" },
    { value: "สมุทรสาคร", display: "สมุทรสาคร" },
    { value: "สมุทรสงคราม", display: "สมุทรสงคราม" },
    { value: "นครปฐม", display: "นครปฐม" },
    { value: "สุพรรณบุรี", display: "สุพรรณบุรี" },
    { value: "กาญจนบุรี", display: "กาญจนบุรี" },
    { value: "ราชบุรี", display: "ราชบุรี" },
    { value: "เพชรบุรี", display: "เพชรบุรี" },
    { value: "ประจวบคีรีขันธ์", display: "ประจวบคีรีขันธ์" },
    //_South
    { value: "กระบี่", display: "กระบี่" },
    { value: "ชุมพร", display: "ชุมพร" },
    { value: "ตรัง", display: "ตรัง" },
    { value: "นครศรีธรรมราช", display: "นครศรีธรรมราช" },
    { value: "นราธิวาส", display: "นราธิวาส" },
    { value: "ปัตตานี", display: "ปัตตานี" },
    { value: "พังงา", display: "พังงา" },
    { value: "พัทลุง", display: "พัทลุง" },
    { value: "ภูเก็ต", display: "ภูเก็ต" },
    { value: "ยะลา", display: "ยะลา" },
    { value: "ระนอง", display: "ระนอง" },
    { value: "สงขลา", display: "สงขลา" },
    { value: "สตูล", display: "สตูล" },
    { value: "สุราษฎร์ธานี", display: "สุราษฎร์ธานี" },
  ].sort((a, b) => a.display.localeCompare(b.display));
  ngOnInit(): void {
    this.regionList = [{ display: "ภาคเหนือ", value: false },
    { display: "ภาคกลาง", value: false },
    { display: "ภาคใต้", value: false },
    { display: "ภาคอีสาน", value: false }
    ];

    this.readCategory();

  }

  search(label) {
    // this.listTags = this.listTag.filter(f => f.display.includes(label));
  }

  readCategory() {
    this.serviceProviderService.postByPass('LineTag/read', {}).subscribe(data => {
      let model: any = {};
      model = data;
      model.objectData.forEach(element => {
        this.listTag.push({ value: element.code, display: element.title, checkTag: false });
      });
      this.listTags = this.listTag;
    }, err => { });

  }

  callBack(param) {
    console.log('--------- callback -------', param);
    this.modelLineCriteria.emit(param);
  }

  // checkbox tags
  ChangeTag(data, ischeckTag) {
    if (ischeckTag != undefined || ischeckTag != '') {
      this.listTag.map(function (val, index) {
        if (val.value == data.value)
          return val.checkTag = ischeckTag;
      });
      this.editModel.listTag = this.listTag;
      this.modelLineCriteria.emit(this.editModel);
    }
  }

  ChangeProvince(data, ischeckTag) {
    if (ischeckTag != undefined || ischeckTag != '') {
      this.listProvince.map(function (val, index) {
        if (val.value == data.value)
          return val.checkProvince = ischeckTag;
      });

      this.editModel.listProvince = this.listProvince;
      this.modelLineCriteria.emit(this.editModel);
    }
  }

  setSelectedRegion(index, event) {
    let temp = [];
    this.regionList[index].value = event;
    this.regionList.forEach(e => {
      if (e.value)
        temp.push(e.display);
    });
    this.editModel.regions = temp;
    this.modelLineCriteria.emit(this.editModel);
  }

  export(): void {
    this.serviceProviderService.post("lineMessageText/export/read", {}).subscribe(data => {
      let model: any = {};
      let result: any = [];
      model = data;
      // this.data = model.objectData; // <----- Pagination
      model.objectData.forEach((e, index) => {
        result.push({
          'ลำดับ': index + 1,
          'หัวข้อ': e.title,
          'จำนวน': e.view,
          'สถานนะ': e.isActive == true ? "เปิดการใช้งาน" : "ปิดการใช้งาน",
          'วันที่เอกสาร': DateFormatPipe.transform(e.createDate),
        })
      });
      let txt = '_' + moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
      this.excelService.downloadFileCSV(result, "รายงาน_Tag" + txt, ['หัวข้อ', 'จำนวน', 'สถานนะ', 'วันที่เอกสาร']);
      // this.excelService.exportAsExcelFile(result, this.appService.title);
    }, err => {
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

}
