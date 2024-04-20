import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  number_plate: string;
}
@Component({
  selector: 'app-vehicle-detail-view',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './vehicle-detail-view.component.html',
  styleUrl: './vehicle-detail-view.component.css'
})
export class VehicleDetailViewComponent {
onMaintenaceSubmit() {
throw new Error('Method not implemented.');
}

  formData: any = {};
  vehicleId: string | null = null;
  vehicleDetails: string | null = null; // Define the type according to your data model
  fuelPayment: string | null = null;
  carAnomalies: string | null = null;
  payment: string | null = null;
  subscription: string | null = null;
  systemUpdates: string | null = null;
  vehicles: Vehicle[] = [];


  constructor(
    private route: ActivatedRoute,
    //private vehicleData: VehicleComponent // Replace 'VehicleService' with your actual service
  ) { }

  onSubmit() {
  throw new Error('Method not implemented.');
  }
  onSubmitAccount() {
  throw new Error('Method not implemented.');
  }
  
  ngOnInit(): void {
    // Get the vehicle ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });

    

  }
}
//google
    /*this.loadGoogleMapsScript(() => {
      // Initialize and add the map
      const location = { lat: 51.5074, lng: -0.1278 }; // Example coordinates for London
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location,
      });

      // Add marker
      const marker = new google.maps.Marker({
        position: location,
        map: map,
      });
    });
    
    }
    // Initialize and add the map
    private loadGoogleMapsScript(callback: () => void) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.head.appendChild(script);
    }*/