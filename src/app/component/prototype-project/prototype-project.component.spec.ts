import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrototypeProjectComponent } from './prototype-project.component';

describe('PrototypeProjectComponent', () => {
  let component: PrototypeProjectComponent;
  let fixture: ComponentFixture<PrototypeProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrototypeProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrototypeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
