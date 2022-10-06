import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectedOptionComponent } from './multi-selected-option.component';

describe('MultiSelectedOptionComponent', () => {
  let component: MultiSelectedOptionComponent;
  let fixture: ComponentFixture<MultiSelectedOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectedOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectedOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
