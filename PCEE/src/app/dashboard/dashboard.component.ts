import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ThemeService } from '../themeService';
import { Chart } from 'chart.js/auto';
import { ServiceData } from '../ServiceData';
import { RouterModule } from '@angular/router';


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

interface DefectResponse{
  anomalies_count: { [key: string]: number };
  code_count: { [key: string]: number };
  total_anomalies: number;
  total_fault_codes: number;
}

interface ServiceCar {
  id: string;
  service_type : string,
  next_service_date: string,
  last_service_date: string,
  service_provider: string,
  created_at: string,
  cost: number,
  mileage: string,
  custom_name: string,
  vehicle: string;
  model: string;
  manufacturer: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  carCountData: CarCountResponse | null = null;
  defectData: DefectResponse | null = null;
  servicesData: ServicesResponse | null = null;
  CarServiceData: ServiceCar[] = [];
  defectKeys: string[] = [];
  token: string | null = null; // Assuming you have a token stored after login
  isLoading: boolean = false;
  isDarkTheme: boolean = false;
  fuelData: any;
  repairData: any;
  chart: any;
  
  
  constructor(private http: HttpClient,
    private themeService : ThemeService,
    private fuelDataService: ServiceData,
    private repairDataServive: ServiceData

  ) {}

  ngOnInit(): void {

    this.token = localStorage.getItem('token');
    this.isLoading = true;

    //themes
    this.isDarkTheme = this.themeService.isDarkTheme();
    this.themeService.isDarkTheme();
    //this.fetchChartData();

    //fetch dates
    const today = new Date();
    const year = today.getFullYear();

    
    this.token = localStorage.getItem('token'); // Retrieve token from local storage
    if (this.token) {
      this.fetchCarCountData();
      this.fetchServiceData();
      this.fetchFuelData(year);
      this.fetchFuelyear();
      this.fetchRepairData();
      this.fetchDefects();
      this.fetchServiceHistory();
    } else {
      console.error('Token is not available.');
    }
    //disable load
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  fetchDefects(): void{
    if (!this.token) {
      console.error('Token is not available.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });

    this.http.get<DefectResponse>('https://www.pcee.xyz/api/vehicles/request-fc', { headers })
      .subscribe(
        (response: DefectResponse) => {
          this.defectData = response;
          this.defectKeys = Object.keys(response.code_count);
          console.log(this.defectData);
        },
        error => {
          console.error('Failed to fetch car count data:', error);
        }
      );
  }

  fetchServiceHistory() {

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    
    this.http.get<ServiceCar[]>('https://www.pcee.xyz/service/history', { headers })
      .subscribe(
        (response: ServiceCar[]) => {
          this.CarServiceData = response;
          console.log(this.CarServiceData);
        },
        error => {
          console.error('Failed to fetch vehicle data:', error);
        }
      );
  }
  fetchCarCountData() {
    if (!this.token) {
      console.error('Token is not available.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });

    this.http.get<CarCountResponse>('https://www.pcee.xyz/api/vehicles/car-count', { headers })
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

    this.http.get<ServicesResponse>('https://www.pcee.xyz/service/total/', { headers })
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

  fetchChartData(){
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  fetchFuelyear(): void{
    
    this.fuelDataService.getFuelD(this.token || '').subscribe(data => {
      this.fuelData = data;
      //console.log(data);
      this.renderFuelChart();
    });
  }
  fetchFuelData(year: number): void {
    this.fuelDataService.getFuelData(year, this.token || '').subscribe(data => {
      this.fuelData = data;
      
    });
  }
  fetchRepairData(): void {
    this.repairDataServive.getRepairData(this.token || '').subscribe(data => {
      this.repairData = data;
      //console.log(data);
      this.renderRepairChart();
    });
  
  }
  renderRepairChart(): void {
    
    if (!this.repairData) {
      return;
    }
    // Prepare data for chart
    const chartData = [];
    for (const month of Object.keys(this.repairData.repair_data_by_month)) {
      const monthData = this.repairData.repair_data_by_month[month] || [];;
      for (const entry of monthData) {
        chartData.push({
          month: this.getMonthName(parseInt(month)),
          cost: parseFloat(entry['total costs'])
        });
      }
    }
    const costData = chartData.map(entry => ({ x: entry.month, y: entry.cost }));
    const ctx = document.getElementById('repair-chart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getMonthNames(),
        datasets: [
          
          {
            label: 'Cost',
            data: costData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  renderFuelChart(): void {
    if (!this.fuelData) {
      return;
    }
    // Prepare data for chart
    const chartData = [];
    for (const month of Object.keys(this.fuelData.fuel_data_by_month)) {
      const monthData = this.fuelData.fuel_data_by_month[month];
      for (const entry of monthData) {
        chartData.push({
          month: parseInt(month),
          mileage: parseFloat(entry.mileage),
          cost: parseFloat(entry.price)
        });
      }
    }

    // Prepare datasets for mileage and cost
    const mileageData = chartData.map(entry => ({ x: entry.month, y: entry.mileage }));
    const costData = chartData.map(entry => ({ x: entry.month, y: entry.cost }));

    // Render chart using Chart.js
    const ctx = document.getElementById('fuel-chart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.getMonthNames(),
        datasets: [
          /*{
            label: 'Fuel Mileage',
            data: mileageData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
          },*/
          {

            label: 'Fuel Cost',
            data: costData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  getMonthNames(): string[] {
    return [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
  }

  getMonthName(monthNumber: number): string {
    return this.getMonthNames()[monthNumber - 1];
  }

}
