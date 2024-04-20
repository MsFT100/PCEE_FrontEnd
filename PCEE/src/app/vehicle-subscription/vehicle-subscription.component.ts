import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Interface } from 'readline';

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  number_plate: string;
}
@Component({
  selector: 'app-vehicle-subscription',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './vehicle-subscription.component.html',
  styleUrl: './vehicle-subscription.component.css'
})
export class VehicleSubscriptionComponent {
  formData: any = {};
  errorMessage: string | null = null;
  vehicleId: string | null = null;
  vehicles: Vehicle[] = [];
  constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute
    ) { }
  onSubmit() {
  throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // Get the vehicle ID from the route parameters
    
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });

    

  }
}
