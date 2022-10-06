import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingParamsComponent } from './routing-params.component';

describe('RoutingParamsComponent', () => {
  let component: RoutingParamsComponent;
  let fixture: ComponentFixture<RoutingParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
