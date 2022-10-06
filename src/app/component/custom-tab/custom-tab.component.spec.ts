import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabComponent } from './custom-tab.component';

describe('CustomTabComponent', () => {
  let component: CustomTabComponent;
  let fixture: ComponentFixture<CustomTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
