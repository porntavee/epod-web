import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropzoneSingleLargeComponent } from './dropzone-single-large.component';

describe('DropzoneSingleLargeComponent', () => {
  let component: DropzoneSingleLargeComponent;
  let fixture: ComponentFixture<DropzoneSingleLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropzoneSingleLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneSingleLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
