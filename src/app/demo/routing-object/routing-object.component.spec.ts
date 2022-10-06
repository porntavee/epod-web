import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingObjectComponent } from './routing-object.component';

describe('RoutingObjectComponent', () => {
  let component: RoutingObjectComponent;
  let fixture: ComponentFixture<RoutingObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
