import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSubscriptionComponent } from './vehicle-subscription.component';

describe('VehicleSubscriptionComponent', () => {
  let component: VehicleSubscriptionComponent;
  let fixture: ComponentFixture<VehicleSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSubscriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
