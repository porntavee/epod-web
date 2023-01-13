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

  constructor(private http: HttpClient,
    private serviceProviderService: ServiceProviderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {

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

  view: any[] = [350, 200];
  legend: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
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
    {
      "name": "20%",
      "value": 20
    },
    {
      "name": "24%",
      "value": 24
    },
    {
      "name": "35%",
      "value": 35
    },
    {
      "name": "21%",
      "value": 21
    }
  ];

  deliveryStatus = [
    {
      "name": "Within time limit",
      "value": 549
    }
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
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
}
