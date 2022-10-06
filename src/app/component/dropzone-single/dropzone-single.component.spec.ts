import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropzoneSingleComponent } from './dropzone-single.component';

describe('DropzoneSingleComponent', () => {
  let component: DropzoneSingleComponent;
  let fixture: ComponentFixture<DropzoneSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropzoneSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
