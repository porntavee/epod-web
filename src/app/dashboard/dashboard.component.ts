import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceProviderService } from '../shared/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  follow = [];
  unFollow = [];
  model: any = {};

  // single: any[];
  single = [
    {
      "name": "IOS ",
      "value": 50
    },
    {
      "name": "Android",
      "value": 25
    },
    {
      "name": "iPad",
      "value": 15
    },
    {
      "name": "Tablet",
      "value": 10
    }
  ];

  single2 = [
    {
      "name": "ข้อความทั้งหมด",
      "value": 100
    },
    {
      "name": "เพิ่มเพื่อน",
      "value": 50
    },
    {
      "name": "บันทึกช่วยจำ",
      "value": 20
    },
    {
      "name": "ข้อความจากสมาชิก",
      "value": 30
    },
    {
      "name": "ข้อความตอบรับอัตโนมัติ",
      "value": 60
    }
  ];

  multi = [
    {
      "name": "",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];
  view: any[] = [1400, 200];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  animations: boolean = true;
  cardColor: string = '#232837';
  cardColorFollow: string = '#aed581';
  cardColorUnFollow: string = '#e57373';

  legend: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#e57373', '#f06292', '#ba68c8', '#64b5f6', '#4db6ac', '#aed581', '#fff176', '#a1887f']
  };

  colorSchemeFollow = {
    domain: ['#4db6ac']
  };

  colorSchemeUnFollow = {
    domain: ['#f06292']
  };

  dashboardModel = [];

  company: any = '';

  constructor(private http: HttpClient,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {

    this.company = localStorage.getItem('company');

    //Object.assign(this, this.single);

    // this.serviceProviderService.post('test/getLimit', {}).subscribe(data => {
    // this.serviceProviderService.post('test/getNumberOfMessagesForMonth', {}).subscribe(data => {
    //   let model: any = {};
    //   model = data;

    //   // let dm: any = { name: "ข้อความส่งฟรี", value: model.value };

    //   this.dashboardModel.push({
    //     "name": "ข้อความส่งฟรี",
    //     "value": model.quota
    //   });

    //   this.dashboardModel.push({
    //     "name": "ส่งข้อความไปแล้ว",
    //     "value": model.totalUsage
    //   });

    //   // this.dashboardModel.push({
    //   //   "name": "ค่าบริการเพิ่มเติม ฿",
    //   //   "value": 0.8
    //   // });

    //   this.dashboardModel = [...this.dashboardModel];

    // }, err => {
    //   // this.spinner.hide();
    //   // this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
    // });
  }

  readFollow() {
    this.spinner.show();
    this.serviceProviderService.post('lineFollow/read', {}).subscribe(data => {
      let model: any = {};
      model = data;
      this.follow = this.follow.concat({
        "name": "Follow",
        "value": model.totalData
      });

      this.readUnFollow();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
    });
  }

  readUnFollow() {
    this.serviceProviderService.post('lineUnFollow/read', {}).subscribe(data => {
      let model: any = {};
      model = data;
      this.unFollow = this.unFollow.concat({
        "name": "Un Follow",
        "value": model.totalData
      });
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 1000 });
    });
  }

  search() {

  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


}
