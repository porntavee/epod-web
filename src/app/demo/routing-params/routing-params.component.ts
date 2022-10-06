import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routing-params',
  templateUrl: './routing-params.component.html',
  styleUrls: ['./routing-params.component.css']
})
export class RoutingParamsComponent implements OnInit {
  id: any;
  id2: any;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      let model: any = this.route.snapshot.params;
      this.id = model.id;
      this.id2 = model.id2;
    });
   }

  ngOnInit(): void {
  }

}
