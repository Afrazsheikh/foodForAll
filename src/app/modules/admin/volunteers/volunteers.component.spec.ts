import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPartnersComponent } from './volunteers.component';

describe('DeliveryPartnersComponent', () => {
  let component: DeliveryPartnersComponent;
  let fixture: ComponentFixture<DeliveryPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
