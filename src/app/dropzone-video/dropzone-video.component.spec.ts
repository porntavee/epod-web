import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropzoneVideoComponent } from './dropzone-video.component';

describe('DropzoneVideoComponent', () => {
  let component: DropzoneVideoComponent;
  let fixture: ComponentFixture<DropzoneVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropzoneVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
