import { Component, OnInit } from '@angular/core';
import { PrototypeProjectComponent } from '../component/prototype-project/prototype-project.component';
import { Logger } from '../shared/logger.service';

@Component({
  selector: 'app-master-vehicle-prototype',
  templateUrl: './master-vehicle-prototype.component.html',
  styleUrls: ['./master-vehicle-prototype.component.css'],
  providers: [PrototypeProjectComponent]
})
export class MasterVehiclePrototypeComponent implements OnInit {
  prototype   : any = {};
 
  constructor(prototype: PrototypeProjectComponent) { 
    this.prototype = prototype;
  }

  ngOnInit(): void {
    this.prototype.api = 'api/Masters/GetVehicle';
    this.prototype.ngOnInit();
  }

}
