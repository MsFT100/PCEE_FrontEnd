import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

interface Subs{
  user: string,
  sub_type: string,
  is_active: boolean,
  payment_type: string,
  payment_date: string,
  expiry: string;
}
interface Subscription{
  subscription: Subs;
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
  subscriptions: Subscription | null = null;
  token: string | null = null;

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

    this.token = localStorage.getItem('token'); // Retrieve token from local storage
    if (this.token) {
      
      this.fetchSubscriptions();
      //this.fetchCarCountData();
    } else {
      console.error('Token is not available.');
    }

  }
  fetchSubscriptions() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    
    const url = `https://pcee.xyz/service/repair/${this.vehicleId}`;
    this.http.get<Subscription>(url, { headers })
      .subscribe(
        (response: Subscription) => {
          this.subscriptions = response;
        },
        error => {
          console.error('Failed to fetch repairs data:', error);
        }
      );
  }
}
