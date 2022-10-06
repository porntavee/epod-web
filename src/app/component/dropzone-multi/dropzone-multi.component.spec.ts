import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropzoneMultiComponent } from './dropzone-multi.component';

describe('DropzoneMultiComponent', () => {
  let component: DropzoneMultiComponent;
  let fixture: ComponentFixture<DropzoneMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropzoneMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
