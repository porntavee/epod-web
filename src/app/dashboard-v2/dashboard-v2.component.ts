import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../shared/excel.service';
import { ServiceProviderService } from '../shared/service-provider.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-v2',
  templateUrl: './dashboard-v2.component.html',
  styleUrls: ['./dashboard-v2.component.css']
})
export class DashboardV2Component implements OnInit {

  model: any;
  criteriaModel: any = {};

  single: any = [];
  view: any[] = [650, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  cardColor: string = '#232837';
  card: any = [];
  cardView: any[] = [300, 350];
  cardColorScheme = {
    domain: ['#7aa3e5', '#A10A28', '#5AA454']
  };

  constructor(private serviceProviderService: ServiceProviderService, private excelService: ExcelService) {
    // Object.assign(this, { multi });
  }

  onSelect(event) {
    console.log(event);
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {

    this.serviceProviderService.post('setQuota/read', {}).subscribe(data => {
      let model: any = {};
      model = data;

      this.criteriaModel.startDate = model.objectData[0].dateStart;
      this.criteriaModel.endDate = model.objectData[0].dateEnd;

    }, err => {
      // this.spinner.hide();
      // this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
    });

    // this.serviceProviderService.post('test/getNumberOfMessagesForMonth', {}).subscribe(data => {
    //   let model: any = {};
    //   model = data;

    //   this.model = model;

    //   // (model.quota - model.totalUsage) * (100/model.quota)
    //   // 525,323 * (1/600,000)


    //   this.single.push(
    //     {
    //       "name": "คงเหลือ",
    //       "value": model.quota - model.totalUsage
    //     });

    //   this.single.push(
    //     {
    //       "name": "ส่งข้อความ",
    //       "value": model.totalUsage
    //     });

    //   this.single = [...this.single];

    //   this.card.push(
    //     {
    //       "name": "ข้อความที่ใช้ต่อเดือน คิดเป็น 100%",
    //       "value": model.quota
    //     });

    //   this.card.push(
    //     {
    //       "name": "ข้อความส่งไปแล้ว คิดเป็น " + (model.totalUsage * (100/model.quota)).toFixed(2).toString() + "%",
    //       "value": model.totalUsage
    //     });

    //   this.card.push(
    //     {
    //       "name": "ข้อความคงเหลือ คิดเป็น " + ((model.quota - model.totalUsage) * (100/model.quota)).toFixed(2).toString() + "%",
    //       "value": model.quota - model.totalUsage
    //     });

    //   this.card = [...this.card];

    // }, err => {
    //   // this.spinner.hide();
    //   // this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
    // });
  }

  formatNumber(param) {
    return param.toLocaleString();
  }

  export(): void {

    // let result: any = [];
    // result.push({
    //   'วันที่': '07-06-2021',
    //   'ข้อความที่ใช้': 5000,
    // },
    // {
    //   'วันที่': '07-06-2021',
    //   'ข้อความที่ใช้': 5000,
    // })
    // this.excelService.downloadFileCSV(result, 'Dashboard_20210601', ['วันที่', 'ข้อความที่ใช้']);

    // this.criteriaModel.skip = 0;
    // this.criteriaModel.limit = 999999;
    this.serviceProviderService.post('test/getNumberOfMessagesEachDay', this.criteriaModel).subscribe(data => {

      let model: any = {};
      model = data;
      let result: any = [];
      model.objectData.forEach((e, index) => {
        result.push({
          'ลำดับ': index + 1,
          'วันที่': moment(e.getDate, 'YYYYMMDD').format('DD-MM-YYYY'),
          'ข้อความที่ใช้': e.apiBroadcast + e.apiPush + e.apiMulticast + e.broadcast,
          '': '',
          ' ': '',
        })
      });

      let txt = 'สถิติ ณ วันที่ ' + moment(Date.now()).format('DD-MM-YYYY HH:mm:ss');
      this.excelService.downloadFileCSV(result, txt, ['วันที่', 'ข้อความที่ใช้', '', ' ']);
      // this.excelService.exportAsExcelFile(result, this.appService.title);
    }, err => {
      // this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

}
