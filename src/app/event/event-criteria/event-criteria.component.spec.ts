import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCriteriaComponent } from './event-criteria.component';

describe('EventCriteriaComponent', () => {
  let component: EventCriteriaComponent;
  let fixture: ComponentFixture<EventCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
