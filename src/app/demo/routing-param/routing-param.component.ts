import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routing-param',
  templateUrl: './routing-param.component.html',
  styleUrls: ['./routing-param.component.css']
})
export class RoutingParamComponent implements OnInit {
  id: any;
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      let model: any = this.route.snapshot.params;
      this.id = model.id;
    });
  }

  ngOnInit(): void {
  }

}
