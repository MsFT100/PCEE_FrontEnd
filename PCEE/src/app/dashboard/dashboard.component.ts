import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ThemeService } from '../themeService';


interface CarCountResponse {
  car_count: number;
  moving: number;
  idle: number;
}

interface ServicesResponse {
  services: { [key: string]: number };
  totalCompleted: number;
  totalUpcoming: number;
  pendingServices: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  carCountData: CarCountResponse | null = null;
  servicesData: ServicesResponse | null = null;
  token: string | null = null; // Assuming you have a token stored after login
  isLoading: boolean = false;
  isDarkTheme: boolean = false;

  
  constructor(private http: HttpClient,
    private themeService : ThemeService
  ) {}

  ngOnInit(): void {

    this.isLoading = true;

    //themes
    this.isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.isDarkTheme();

    this.token = localStorage.getItem('token'); // Retrieve token from local storage
    if (this.token) {
      this.fetchCarCountData();
      this.fetchServiceData();
    } else {
      console.error('Token is not available.');
    }
    //disable load
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
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
          //console.log(response);
        },
        error => {
          console.error('Failed to fetch car count data:', error);
        }
      );
  }
  fetchServiceData() {
    if (!this.token) {
      console.error('Token is not available.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });

    this.http.get<ServicesResponse>('https://pcee.xyz/service/total/', { headers })
      .subscribe(
        (response: any) => {
          this.servicesData = {
            services: response.services,
            totalCompleted: response['total completed'],
            totalUpcoming: response['total upcoming'],
            pendingServices: response["pending services"]
          };
          //console.log(response);
        },
        error => {
          console.error('Failed to fetch service data:', error);
        }
      );
  }
}
