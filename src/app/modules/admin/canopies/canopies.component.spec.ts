import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanopiesComponent } from './canopies.component';

describe('CanopiesComponent', () => {
  let component: CanopiesComponent;
  let fixture: ComponentFixture<CanopiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanopiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanopiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
