import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routing-object',
  templateUrl: './routing-object.component.html',
  styleUrls: ['./routing-object.component.css']
})
export class RoutingObjectComponent implements OnInit {
  model: any;
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => { 
      let model: any = params;
      if (model) {
        // this.id = JSON.parse(model.special);
        this.model = JSON.parse(model.special);
      }
    });
  }

  ngOnInit(): void {
  }

}
