import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLargeComponent } from './button-large.component';

describe('ButtonLargeComponent', () => {
  let component: ButtonLargeComponent;
  let fixture: ComponentFixture<ButtonLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
