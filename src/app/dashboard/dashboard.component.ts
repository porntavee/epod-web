import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceProviderService } from '../shared/service-provider.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

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

  criteriaModel: any = {};
  deliveryStatusModel: any = {WithInTime: 0, OutOfTime: 0, Reject: 0};

  ngOnInit(): void {

    const startDate = new Date();
    const endDate = new Date();
    // this.criteriaModel.startDate = moment(startDate.setDate(startDate.getDate() - 7)).format('YYYYMMDD');
    this.criteriaModel.startDate = moment(startDate).format('YYYYMMDD');
    this.criteriaModel.endDate = moment(endDate).format('YYYYMMDD');
  }

  read() {
    this.spinner.show();

    let criteria = {
      "userinformation": this.serviceProviderService.userinformation,
      "InvoiceDateStart": this.verifyDateTime(this.criteriaModel.startDate),
      "InvoiceDateEnd": this.verifyDateTime(this.criteriaModel.endDate),
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/Report/Dashborad_DeliveriesByCountryPie', criteria).subscribe(data => {
      this.spinner.hide();
      this.deliveryByCountry = [];
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
  
    this.serviceProviderService.post('api/Report/Dashborad_DeliveryStatusPie', criteria).subscribe(data => {
      this.spinner.hide();
      this.deliveryStatus = [];
      let model: any = {};

      model = data;
      this.deliveryStatusModel = model.Data[0];

      let json1 = JSON.stringify(model.Data);

      this.deliveryStatus.push(
        {
          "name": "Within time limit",
          "value": model.Data[0].WithInTime || 0
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

    this.serviceProviderService.post('api/Report/Dashborad_DeliveriesByCountryChart', criteria).subscribe(data => {
      this.spinner.hide();
      this.deliveryByCountry3 = [];
      let model: any = {};
      debugger
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
            "value": element.TotalInvoice
          });
      });

      this.deliveryByCountry3 = [...this.deliveryByCountry3];

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
    {
      "name": "Total Fleet",
      "value": 63
    },
    {
      "name": "On the Move",
      "value": 60
    },
    {
      "name": "In Maintenance",
      "value": 3
    }
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
    {
      "name": "January 2022",
      "series": [
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        },
        {
          "name": "1990",
          "value": 62000000
        }
      ]
    },

    {
      "name": "February 2022",
      "series": [
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        },
        {
          "name": "1990",
          "value": 250000000
        }
      ]
    },

    {
      "name": "March 2022",
      "series": [
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        },
        {
          "name": "1990",
          "value": 58000000
        }
      ]
    },
    {
      "name": "April 2022",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "May 2022",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "June 2022",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "July 2022",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "Auguest 2022",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "January 2023",
      "series": [
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        },
        {
          "name": "1990",
          "value": 62000000
        }
      ]
    },

    {
      "name": "February 2023",
      "series": [
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        },
        {
          "name": "1990",
          "value": 250000000
        }
      ]
    },

    {
      "name": "March 2023",
      "series": [
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        },
        {
          "name": "1990",
          "value": 58000000
        }
      ]
    },
    {
      "name": "April 2023",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "May 2023",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "June 2023",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "July 2023",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    },
    {
      "name": "Auguest 2023",
      "series": [
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "1990",
          "value": 57000000
        }
      ]
    }
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
}
