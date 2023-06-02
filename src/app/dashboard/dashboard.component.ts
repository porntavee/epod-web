import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceProviderService } from '../shared/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import{ GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {

  }

  _mode: any = 'รายวัน';
  criteriaModel: any = {};
  deliveryStatusModel: any = { TotalInvoice: 0, WithInTime_Percent: '0', WithInTime: 0, OutOfTime: 0, Reject: 0 };
  proofDeliveryStatusModel: any = { TotalInvoice: 0, WithInTime_Percent: '0', WithInTime: 0, OutOfTime: 0, Reject: 0 };
  fleetModel: any = { OnTheMove_Percent: 0 };

  ngOnInit(): void {

    const startDate = new Date();
    const endDate = new Date();
    // this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
    this.criteriaModel.startDate = moment(startDate).format('YYYYMMDD');
    this.criteriaModel.endDate = moment(endDate).format('YYYYMMDD');
    // this.read();
    this.selectMode('รายวัน');
  }

  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "InvoiceDateStart": this.verifyDateTime(this.criteriaModel.startDate),
      "InvoiceDateEnd": this.verifyDateTime(this.criteriaModel.endDate),
      "TransportDateBegin": this.verifyDateTime(this.criteriaModel.startDate),
      "TransportDateEnd": this.verifyDateTime(this.criteriaModel.endDate),
    }

    let json = JSON.stringify(criteria);


    this.fleet = [];
    //dashboard 1
    this.serviceProviderService.post('api/Report/Dashborad_FleetPie', criteria).subscribe(data => {
      this.spinner.hide();
      // this.fleet = [];

      let model: any = {};
      model = data;

      let json1 = JSON.stringify(model.Data);

      this.fleetModel = model.Data[0];
      this.fleet.push(
        {
          "name": "Total Fleet",
          "value": model.Data[0].TotalFleet.toFixed(0)
        },
        {
          "name": "On the Move",
          "value": model.Data[0].OnTheMove.toFixed(0)
        },
        {
          "name": "Pending",
          "value": model.Data[0].TotalFleet.toFixed(0) - (model.Data[0].OnTheMove + model.Data[0].InMaintenance.toFixed(0))
        },
        {
          "name": "In Maintenance",
          "value": model.Data[0].InMaintenance.toFixed(0)
        }
        );

      // model.Data.forEach(element => {
      //   this.deliveryByCountry.push(
      //     {
      //       "name": element.Code + ' ' + element.Percent.toFixed(2) + "%",
      //       "value": element.Percent.toFixed(2)
      //     });
      // });

      this.fleet = [...this.fleet];
      debugger

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.deliveryByCountry = [];
    //dashboard 2
    this.serviceProviderService.post('api/Report/Dashborad_DeliveriesByCountryPie', criteria).subscribe(data => {
      this.spinner.hide();
      // this.deliveryByCountry = [];
      let model: any = {};
      model = data;

      let json1 = JSON.stringify(model.Data);

      model.Data.forEach(element => {
        this.deliveryByCountry.push(
          {
            "name": element.Code + ' ' + element.Percent.toFixed(2) + "%",
            "value": element.Percent.toFixed(2)
          });
      });

      this.deliveryByCountry = [...this.deliveryByCountry];

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.deliveryStatus = [];
    //dashboard 3
    this.serviceProviderService.post('api/Report/Dashborad_DeliveryStatusPie', criteria).subscribe(data => {
      this.spinner.hide();
      // this.deliveryStatus = [];
      let model: any = {};

      model = data;
      this.deliveryStatusModel = model.Data[0];

      if (this.deliveryStatusModel.WithInTime_Percent != null)
        this.deliveryStatusModel.WithInTime_Percent = this.deliveryStatusModel.WithInTime_Percent.toFixed(2) + '%';
      else
        this.deliveryStatusModel.WithInTime_Percent = 0;

      let json1 = JSON.stringify(model.Data);

      this.deliveryStatus.push(
        {
          "name": "WithInTime",
          "value": model.Data[0].WithInTime || 0
        },
        {
          "name": "OutOfTime",
          "value": model.Data[0].OutOfTime || 0
        },
        {
          "name": "Reject",
          "value": model.Data[0].Reject || 0
        });

      // model.Data.forEach(element => {
      //   this.deliveryStatus.push(
      //     {
      //       "name": element.Code + ' ' + element.Percent + "%",
      //       "value": element.Percent
      //     });
      // });

      this.deliveryStatus = [...this.deliveryStatus];

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.deliveryByCountry3 = [];
    //dashboard 4
    this.serviceProviderService.post('api/Report/Dashborad_DeliveriesByCountryChart', criteria).subscribe(data => {
      this.spinner.hide();
      // this.deliveryByCountry3 = [];
      let model: any = {};

      model = data;
      // this.deliveryStatusModel = model.Data[0];

      let json1 = JSON.stringify(model.Data);

      // this.deliveryByCountry3.push(
      //   {
      //     "name": "Within time limit",
      //     "value": 100
      //   });

      model.Data.forEach(element => {
        this.deliveryByCountry3.push(
          {
            "name": element.Code,
            "value": element.TotalInvoice || 0
          });
      });

      this.deliveryByCountry3 = [...this.deliveryByCountry3];

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.tripPerDay = [];
    //dashboard 5
    this.serviceProviderService.post('api/Report/Dashborad_TripPerDay', criteria).subscribe(data => {
      this.spinner.hide();
      // this.tripPerDay = [];
      let model: any = {};

      model = data;
      // this.deliveryStatusModel = model.Data[0];

      let json1 = JSON.stringify(model.Data);

      // this.deliveryByCountry3.push(
      //   {
      //     "name": "Within time limit",
      //     "value": 100
      //   });

      model.Data.forEach(element => {
        this.tripPerDay.push(
          {
            "name": element.TransportDate,
            "series": [
              // {
              //   "name": "TotalTrip",
              //   "value": element.TotalTrip
              // },
              {
                "name": "NumTrip",
                "value": element.NumTrip
              },
              {
                "name": "NumTripOutSource",
                "value": element.NumTripOutSource
              },
            ]
          });
      });

      this.tripPerDay = [...this.tripPerDay];


    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.proofDeliveryStatus = [];
    //dashboard 6
    this.serviceProviderService.post('api/Report/Dashborad_ProofOfDeliveryStatusPie', criteria).subscribe(data => {
      this.spinner.hide();
      // this.proofDeliveryStatus = [];
      let model: any = {};

      model = data;
      this.proofDeliveryStatusModel = model.Data[0];

      if (this.proofDeliveryStatusModel.WithInTime_Percent != null)
        this.proofDeliveryStatusModel.WithInTime_Percent = this.proofDeliveryStatusModel.WithInTime_Percent.toFixed(2) + '%';
      else
        this.proofDeliveryStatusModel.WithInTime_Percent = 0;

      let json1 = JSON.stringify(model.Data);

      this.proofDeliveryStatus.push(
        {
          "name": "WithInTime",
          "value": model.Data[0].WithInTime || 0
        },
        {
          "name": "OutOfTime",
          "value": model.Data[0].OutOfTime || 0
        },
        {
          "name": "Reject",
          "value": model.Data[0].Reject || 0
        });

      // model.Data.forEach(element => {
      //   this.deliveryStatus.push(
      //     {
      //       "name": element.Code + ' ' + element.Percent + "%",
      //       "value": element.Percent
      //     });
      // });

      this.proofDeliveryStatus = [...this.proofDeliveryStatus];
      // debugger

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });

    this.proofDeliveryByCountry3 = [];
    //dashboard 7
    this.serviceProviderService.post('api/Report/Dashborad_ProofOfDeliveriesByCountryChart', criteria).subscribe(data => {
      this.spinner.hide();
      // this.proofDeliveryByCountry3 = [];
      let model: any = {};

      model = data;
      // this.deliveryStatusModel = model.Data[0];

      let json1 = JSON.stringify(model.Data);

      // this.deliveryByCountry3.push(
      //   {
      //     "name": "Within time limit",
      //     "value": 100
      //   });

      model.Data.forEach(element => {
        this.proofDeliveryByCountry3.push(
          {
            "name": element.Code,
            "value": element.TotalInvoice || 0
          });
      });

      this.proofDeliveryByCountry3 = [...this.proofDeliveryByCountry3];

    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  verifyDateTime(date: string, from: string = ''): any {
    let dateObj: any = date == "Invalid date" || date == undefined ? undefined : moment(date).format('YYYY-MM-DD');

    return dateObj;
  }

  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  checkMode(param) {
    if (param == this._mode)
      return 'green';
    else
      return 'grey';
  }

  selectMode(param) {

    this.deliveryStatusModel = { TotalInvoice: 0, WithInTime_Percent: '0', WithInTime: 0, OutOfTime: 0, Reject: 0 };
    this.proofDeliveryStatusModel = { TotalInvoice: 0, WithInTime_Percent: '0', WithInTime: 0, OutOfTime: 0, Reject: 0 };
    this.fleetModel = { OnTheMove_Percent: 0 };

    if (param == 'รายวัน') {
      this._mode = 'รายวัน';
      const startDate = new Date();
      const endDate = new Date();
      // this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
      this.criteriaModel.startDate = moment(startDate).format('YYYYMMDD');
      this.criteriaModel.endDate = moment(endDate).format('YYYYMMDD');

      this.read();
    }
    else if (param == 'รายสัปดาห์') {
      this._mode = 'รายสัปดาห์';
      const startDate = new Date();
      const endDate = new Date();
      this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
      // this.criteriaModel.startDate = moment(startDate).format('YYYYMMDD');
      this.criteriaModel.endDate = moment(endDate).format('YYYYMMDD');
      this.read();
    }
    else if (param == 'รายเดือน') {
      this._mode = 'รายเดือน';

      // var date = new Date();
      // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const startDate = new Date();
      const endDate = new Date();
      // this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
      this.criteriaModel.startDate = moment(new Date(startDate.getFullYear(), startDate.getMonth(), 1)).format('YYYYMMDD');
      this.criteriaModel.endDate = moment(new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)).format('YYYYMMDD');
      this.read();
    }
  }

  view: any[] = [350, 200];
  legend: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5', '#c8f557', '#8eed4f', '#0ceef5']
  };

  // options delivery by country
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  // options delivery by country 2
  animations: boolean = true;

  // options trip per day
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Trip per Day & Outsoure';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Normalized Population';

  // options delivery by country
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;

  readGaugeChart() {
    // Object.assign(this, { this.gaugeModel });
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

  labelFormatting(c) {
    return `${(c.label)} Population`;
  }

  fleet = [
    // {
    //   "name": "Total Fleet",
    //   "value": 63
    // },
    // {
    //   "name": "On the Move",
    //   "value": 60
    // },
    // {
    //   "name": "In Maintenance",
    //   "value": 3
    // }
  ];

  deliveryByCountry = [
    // {
    //   "name": "20%",
    //   "value": 20
    // },
    // {
    //   "name": "24%",
    //   "value": 24
    // },
    // {
    //   "name": "35%",
    //   "value": 35
    // },
    // {
    //   "name": "21%",
    //   "value": 21
    // }
  ];

  deliveryStatus = [
    // {
    //   "name": "Within time limit",
    //   "value": 549
    // }

    // ไม่เกัี่ยว
    // ,
    // {
    //   "name": "Out of time limit",
    //   "value": 73
    // },
    // {
    //   "name": "Reject",
    //   "value": 0
    // }
  ];

  deliveryByCountry2 = [
    {
      "name": "Austria",
      "value": 19
    },
    {
      "name": "Switzerland",
      "value": 21
    },
    {
      "name": "France",
      "value": 25
    },
    {
      "name": "Germany",
      "value": 36
    }
  ];

  tripPerDay = [
    // {
    //   "name": "January 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 73000000
    //     },
    //     {
    //       "name": "2011",
    //       "value": 89400000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 62000000
    //     }
    //   ]
    // },

    // {
    //   "name": "February 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 309000000
    //     },
    //     {
    //       "name": "2011",
    //       "value": 311000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 250000000
    //     }
    //   ]
    // },

    // {
    //   "name": "March 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 50000020
    //     },
    //     {
    //       "name": "2011",
    //       "value": 58000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 58000000
    //     }
    //   ]
    // },
    // {
    //   "name": "April 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "May 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "June 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "July 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "Auguest 2022",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "January 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 73000000
    //     },
    //     {
    //       "name": "2011",
    //       "value": 89400000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 62000000
    //     }
    //   ]
    // },

    // {
    //   "name": "February 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 309000000
    //     },
    //     {
    //       "name": "2011",
    //       "value": 311000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 250000000
    //     }
    //   ]
    // },

    // {
    //   "name": "March 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 50000020
    //     },
    //     {
    //       "name": "2011",
    //       "value": 58000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 58000000
    //     }
    //   ]
    // },
    // {
    //   "name": "April 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "May 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "June 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "July 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // },
    // {
    //   "name": "Auguest 2023",
    //   "series": [
    //     {
    //       "name": "2010",
    //       "value": 62000000
    //     },
    //     {
    //       "name": "1990",
    //       "value": 57000000
    //     }
    //   ]
    // }
  ];

  deliveryByCountry3 = [
    // {
    //   "name": "Germany",
    //   "value": 8940000
    // },
    // {
    //   "name": "USA",
    //   "value": 5000000
    // },
    // {
    //   "name": "France",
    //   "value": 7200000
    // }
  ];

  proofDeliveryStatus = [];
  proofDeliveryByCountry3 = [];

  timerModel: any = { displayMinute: '15', autoRefresh: false};
  displayMinuteTmp: any;
  msSinceEpoch: any;
  timeLater: any;
  showNextTime: any;
 
  autoRefresh() {
    // console.log('autoRefresh', this.timerModel.autoRefresh);
    if (this.timerModel.autoRefresh) {
      // Display Timer temp for new timer loop.
      this.displayMinuteTmp = this.timerModel.displayMinute;

      let today = new Date();

      this.msSinceEpoch = today.getTime();
      this.timeLater = new Date(this.msSinceEpoch + this.timerModel.displayMinute * 60 * 1000);
      this.showNextTime = 'โหลดข้อมูลใหม่ เวลา : ' + moment(this.timeLater).format('HH:mm:ss');

      // console.log(this.timerModel.displayMinute + ' minute later Refresh Data Next Time', this.showNextTime);
      // console.log('autoRefresh is true displayMinute', this.timerModel.displayMinute);

      GlobalConstants.interValtimer = setInterval(() => {
        let iToday = new Date();

        // console.log(moment(iToday).format('YYYY-MM-DD HH:mm:ss'), moment(this.timeLater).format('YYYY-MM-DD HH:mm:ss'));
        if (moment(iToday).format('YYYY-MM-DD HH:mm:ss') == moment(this.timeLater).format('YYYY-MM-DD HH:mm:ss')) {
          
          // Check if timeLater date is greater than time later change endDate.
          if ((moment(this.timeLater).format('YYYYMMDD') > moment(today).format('YYYYMMDD'))) {
            this.criteriaModel.startDate = moment(this.timeLater).format('YYYYMMDD');
            this.criteriaModel.endDate = moment(this.timeLater).format('YYYYMMDD');
          }

          // Refresh data.
          // console.log('Refresh Data call method: readAll()');
          this.read();

          // Clear interval timer when timeLater is equal current time.
          clearInterval(GlobalConstants.interValtimer);
          this.autoRefresh();
        }
      }, 1000);
    } else {
      this.timerModel.displayMinute = this.displayMinuteTmp ? this.displayMinuteTmp : this.timerModel.displayMinute;
      this.showNextTime = '';
      // Clear interval timer when auto refresh not checked.
      clearInterval(GlobalConstants.interValtimer);
      // console.log('autoRefresh is false displayMinute', this.timerModel.displayMinute);
    }
  }
}
