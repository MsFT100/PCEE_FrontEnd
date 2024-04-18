import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-vehicle-detail-view',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './vehicle-detail-view.component.html',
  styleUrl: './vehicle-detail-view.component.css'
})
export class VehicleDetailViewComponent {
  vehicleId: string | null = null;
  vehicleDetails: any; // Define the type according to your data model

  constructor(
    private route: ActivatedRoute,
    //private vehicleData: VehicleComponent // Replace 'VehicleService' with your actual service
  ) { }

  ngOnInit(): void {
    // Get the vehicle ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });

    //google
    this.loadGoogleMapsScript(() => {
      // Initialize and add the map
      const location = { lat: 51.5074, lng: -0.1278 }; // Example coordinates for London
      /*const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location,
      });*/

      // Add marker
      /*const marker = new google.maps.Marker({
        position: location,
        map: map,
      });*/
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
  }

}
