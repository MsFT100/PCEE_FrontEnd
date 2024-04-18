import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailViewComponent } from './vehicle-detail-view.component';

describe('VehicleDetailViewComponent', () => {
  let component: VehicleDetailViewComponent;
  let fixture: ComponentFixture<VehicleDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
