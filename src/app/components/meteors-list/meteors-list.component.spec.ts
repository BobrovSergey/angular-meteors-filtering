import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteorsListComponent } from './meteors-list.component';

describe('MeteorsListComponent', () => {
  let component: MeteorsListComponent;
  let fixture: ComponentFixture<MeteorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
