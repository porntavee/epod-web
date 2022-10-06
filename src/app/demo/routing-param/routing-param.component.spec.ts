import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingParamComponent } from './routing-param.component';

describe('RoutingParamComponent', () => {
  let component: RoutingParamComponent;
  let fixture: ComponentFixture<RoutingParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
