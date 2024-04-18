import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Vehicle {
  model: string;
  manufacturer: string;
  number_plate: string;
}

interface CarCountResponse {
  car_count: number;
  moving: number;
  idle: number;
}
@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
    
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  formData: any = {};
  vehicles: Vehicle[] = [];
  token: string | null = null;
  errorMessage: string | null = null;
  carCountData: CarCountResponse | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    //register for messages
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['successMessage'] || null;
    });

    this.token = localStorage.getItem('token'); // Retrieve token from local storage
    if (this.token) {
      
      this.fetchVehicleData();
      this.fetchCarCountData();
    } else {
      console.error('Token is not available.');
    }
  }
  
  fetchCarCountData() {
    if (!this.token) {
      console.error('Token is not available.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });

    this.http.get<CarCountResponse>('https://pcee.xyz/api/vehicles/car-count', { headers })
      .subscribe(
        (response: CarCountResponse) => {
          this.carCountData = response;
        },
        error => {
          console.error('Failed to fetch car count data:', error);
        }
      );
  }
  fetchVehicleData() {

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    
    this.http.get<Vehicle[]>('https://pcee.xyz/api/vehicles', { headers })
      .subscribe(
        (response: Vehicle[]) => {
          this.vehicles = response;
        },
        error => {
          console.error('Failed to fetch vehicle data:', error);
        }
      );
  }

  onSubmit() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`
      });

      this.http.post('https://pcee.xyz/api/vehicles/', this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle added successfully:', response);
            // Reset form and any error message
            this.formData = {};
            this.errorMessage = null;
            // Fetch vehicle data again to update the list
            this.fetchVehicleData();
          },
          error => {
            console.error('Failed to add vehicle:', error);
            // Display error message to the user
            this.errorMessage = 'Failed to add vehicle. Please try again.';
          }
        );
    } else {
      console.error('Token is not available.');
    }
  }
}
