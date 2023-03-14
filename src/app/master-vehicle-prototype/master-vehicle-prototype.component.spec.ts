import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterVehiclePrototypeComponent } from './master-vehicle-prototype.component';

describe('MasterVehiclePrototypeComponent', () => {
  let component: MasterVehiclePrototypeComponent;
  let fixture: ComponentFixture<MasterVehiclePrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterVehiclePrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVehiclePrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
