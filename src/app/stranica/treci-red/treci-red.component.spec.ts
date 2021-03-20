import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreciRedComponent } from './treci-red.component';

describe('TreciRedComponent', () => {
  let component: TreciRedComponent;
  let fixture: ComponentFixture<TreciRedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreciRedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreciRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
