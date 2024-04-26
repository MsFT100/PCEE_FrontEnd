import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import PdfPrinter from 'pdfmake';
import csvtojson from 'csvtojson';
import { wrap } from 'module';
import { GpsService } from '../GPSService';


declare var google: any;

interface Vehicle {
  id: string;
  model: string;
  manufacturer: string;
  number_plate: string;
}

interface RepairsCurrentCar {
  id: string;
  service_type : string,
  repaired_date: string,
  total_cost: string,
  mileage: string,
  custom_name: string,
}
interface ServiceCurrentCar {
  id: string;
  service_type : string,
  next_service_date: string,
  last_service_date: string,
  service_provider: string,
  created_at: string,
  cost: number,
  mileage: string,
  custom_name: string,
}

interface Vehicle {
  id: string;
  vehicle_ident_no: number;
  device_number: string;
  device_sim: string;
  device_name: string;
  manufacturer: string;
  model: string;
  year: number;
  vehicle_type: string;
  fuel_id: string | null;
  fuel_type: string;
  transmission: string;
  eng_displacement: string;
  vehicle_color: string;
  vehicle_reg_no: string;
  number_plate: string;
  created_at: string;
  custom_name: string;
  user: string;
}

interface Throttle {
  id: number;
  timestamp: string;
  throttle_opening_value: number;
  speed_id: number;
  custom_name: string;
  vehicle: string;
}

interface Mileage {
  id: number;
  mileage: number;
  odometer: number;
  vehicle_status: number;
  timestamp: string;
  custom_name: string;
  vehicle: string;
}
interface Battery {
  id: number;
  state_of_charge: string;
  state_of_health: string;
  timestamp: string;
  voltage: number;
  current: number;
  temperature: number;
  battery_type: string;
  custom_name: string;
  vehicle: string;
}

interface Coolant {
  id: number;
  protocol_header: string;
  rpm_id: number;
  speed_id: number;
  engine_load_id: number;
  timestamp: string;
  coolant_temp_value: number;
  custom_name: string;
  vehicle: string;
}

interface RPM {
  id: number;
  protocol_header: string;
  engine_load: number;
  timestamp: string;
  rpm_value: number;
  custom_name: string;
  vehicle: string;
}

interface GPS {
  id: number;
  protocol_header: string;
  gps_signal_status: string;
  course_degrees: string;
  magnetic_variation: string;
  horizontal_dilution: string;
  rfid: string;
  ew_indicator: string;
  gps_fix: string;
  speed: number;
  timestamp: string;
  latitude: string;
  longitude: string;
  heading: string;
  alititude: string;
  custom_name: string;
  vehicle: string;
}

interface Fuel {
  id: number;
  timestamp: string;
  fuel_level: string;
  fuel_consumption: string;
  instantaneous_fuel_consumption_rate: string;
  average_fuel_consumption_rate: string;
  total_accumulated_fuel: string;
  distance: number;
  fuel_efficiency: number;
  custom_name: string;
  vehicle: string;
}

interface EngineLoad {
  id: number;
  timestamp: string;
  engine_load_value: number;
  rpm: number;
  throttle_id: number;
  speed: number;
  fuel: number;
  custom_name: string;
  vehicle: string;
}

interface Speed {
  id: number;
  protocol_header: string;
  timestamp: string;
  speed_value: number;
  gps_id: number;
  acceleration: number;
  custom_name: string;
  vehicle: string;
}

interface ErrorCode {
  id: string;
  fault_code: string;
  description: string;
  severity: string;
  timestamp: string;
  custom_name: string;
  vehicle: string;
}

// Define interfaces for other objects similarly

interface VehicleData {
  vehicle: Vehicle;
  throttle: Throttle;
  mileage: Mileage;
  speed: Speed;
  engineload: EngineLoad;
  "error codes": ErrorCode;
  gps: GPS;
  fuel: Fuel;
  battery: Battery;
  coolant: Coolant;
  rpm: RPM;
  
  // Define other properties similarly
}
interface Services{
  vehicle: Vehicle;
  "Service Schedule": ServiceCurrentCar[];
}
interface VehicleFormErrorData {
  manufacturer?: string[];
  model?: string[];
  year?: number[];
  vehicle_type?: string[];
  fuel_id?: number[];
  transmission?: number[];
  eng_displacement?: string[];
  vehicle_color?: string[];
  vehicle_reg_no?: string[];
  number_plate?: string[];
  custom_name?: string[];
  vehicle_ident_no?: number[];
  device_number?: string[];
  device_name?: string[];
  device_sim?: string[];
  protocol_header?: string[];
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

  private readonly POLLING_INTERVAL = 30000; // 10 seconds
  private pollSubscription: Subscription | undefined;
  formData: any = {};
  vehicleId: string | null = null;
  token: string | null = null;
  vehicleDetails: string | null = null; // Define the type according to your data model
  fuelPayment: string | null = null;
  carAnomalies: string | null = null;
  payment: string | null = null;
  subscription: string | null = null;
  systemUpdates: string | null = null;
  repairs:RepairsCurrentCar[] = [];
  services: Services | null = null;

  vehicleData: VehicleData | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  currentDate: string | null = null;
  isLoading: boolean = false;

  //map
  map: any;
  gpsData: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private gpsService: GpsService
    //private vehicleData: VehicleComponent // Replace 'VehicleService' with your actual service
  ) { }

  deleteVehicle() {
    // Construct the URL with the vehicleId
    const url = `https://pcee.xyz/api/vehicles/${this.vehicleId}/request-vd`;

    // Set the headers with the authorization token
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });

    // Send the DELETE request
    this.http.delete(url, { headers }).subscribe(
      () => {
        this.router.navigate(['/vehicle'], { queryParams: { successMessage: 'Car was Deleted request successful!' } });
        
        console.log('Delete request successful');
        
      },
      error => {
        console.error('Failed to send delete request:', error);
        // Handle errors appropriately
      }
    );
    }
      
  onMaintenaceSubmit() {
    throw new Error('Method not implemented.');
    }
  onSubmitAccount() {
  throw new Error('Method not implemented.');
  }
  
  ngOnInit(): void {

    this.isLoading = true;
    //register for messages
    this.route.queryParams.subscribe(params => {
      this.successMessage = params['successMessage'] || null;
    });

    // Get the vehicle ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });

    this.token = localStorage.getItem('token'); // Retrieve token from local storage
    if (this.token) {
      
      //this.fetchServiceData();
      this.fetchRepairData();
      this.fetchVehicleData();
      this.fetchServiceData();
      this.fetchGPSData();
      this.startPolling();
      
      this.currentDate = this.getCurrentDate();
    } else {
      console.error('Token is not available.');
    }
    
     //disable load
     setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the polling subscription when component is destroyed
    this.stopPolling();
  }

  private startPolling(): void {
    // Use RxJS interval to create an observable that emits every 10 seconds
    this.pollSubscription = interval(this.POLLING_INTERVAL).pipe(
      // Use switchMap to cancel previous request if not completed
      
      switchMap(async () => this.fetchVehicleData())
      
    ).subscribe(
      () => {
        // Data fetched successfully, you can update UI or perform other operations here
        this.route.queryParams.subscribe(params => {
          this.successMessage = params['successMessage'] || null;
        });
      },
      error => {
        console.error('Failed to fetch data:', error);
      }
    );
  }
  getCurrentDate(): string | null {
    // Get the current date in the format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  fetchFuelData() {

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    
    const url = `https://pcee.xyz/service/repair/${this.vehicleId}`;
    this.http.get<RepairsCurrentCar[]>(url, { headers })
      .subscribe(
        (response: RepairsCurrentCar[]) => {
          this.repairs = response;
        },
        error => {
          console.error('Failed to fetch repairs data:', error);
        }
      );
  }
  fetchRepairData() {

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    
    const url = `https://pcee.xyz/service/repair/${this.vehicleId}`;
    this.http.get<RepairsCurrentCar[]>(url, { headers })
      .subscribe(
        (response: RepairsCurrentCar[]) => {
          this.repairs = response;
        },
        error => {
          console.error('Failed to fetch repairs data:', error);
        }
      );
  }

  fetchServiceData() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
  
    const url = `https://pcee.xyz/service/${this.vehicleId}`;
    this.http.get<Services>(url, { headers })
      .subscribe(
        (response: Services) => {

          // Assign the array of service schedules to this.services
          this.services = response;
          console.log(this.services);
        },
        error => {
          console.error('Failed to fetch repairs data:', error);
        }
      );
  }
  
  fetchVehicleData(){
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    const url = `https://pcee.xyz/api/vehicles/${this.vehicleId}`;
    this.http.get<VehicleData>(url, { headers })
      .subscribe(
        (response: VehicleData) => {
          //console.log('Response:', response);
          this.vehicleData = response;
        },
        error => {
          console.error('Failed to fetch repairs data:', error);
        }
      );
  }

  onSubmitUpdateVehicle() {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
  
    if (this.token) {
      const url = `https://pcee.xyz/api/vehicles/${this.vehicleId}/request-vu`;
  
      this.http.patch<VehicleFormErrorData>(url, this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle update request successful:', response);
            // Reset form and any error message
            this.resetFormData();
            this.errorMessage = null;
  
            // Reload the page
            this.fetchVehicleData();
            this.router.navigate(['/vehicle-detail-view/', this.vehicleId], { queryParams: { successMessage: 'Vehicle update request successful!' } });
            // Reload the current page
            window.location.reload();

          },
          error => {
            console.error('Failed to request vehicle update:', error);
            if (error && error.error) {
              this.errorMessage = Object.values(error.error).flat().join('\n');
            } else {
              // If the error object doesn't contain specific field errors, display a generic error message
              this.errorMessage = 'Failed to request vehicle update. Please try again.';
            }
          }
        );
    } else {
      console.error('Token is not available.');
      // Handle token not available scenario (e.g., redirect to login page)
    }
  }
  
  resetFormData() {
    this.formData = {
      manufacturer: '',
      model: '',
      year: 0,
      vehicle_type: '',
      fuel_id: 0,
      transmission: 0,
      eng_displacement: '',
      vehicle_color: '',
      vehicle_reg_no: '',
      number_plate: '',
      custom_name: '',
      vehicle_ident_no: 0,
      device_number: '',
      device_name: '',
      device_sim: '',
      protocol_header: ''
    };
  }

  //GPS Data
  initMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 8
    });
  }

  fetchGPSData(): void {
    setInterval(() => {
      this.gpsService.getGpsData(this.vehicleId || '', this.token || '')
      .subscribe(data => {
        this.gpsData = data;
        console.log(this.gpsData); // Handle the GPS data here
        this.initializeMap(data.latitude, data.longitude);
      }, error => {
        console.error('Failed to fetch GPS data:', error);
      });
    }, 10000); // Fetch data every 10 seconds
  }
  //initialise the map
  initializeMap(latitude: number, longitude: number): void {
    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 8, // Adjust the initial zoom level as needed
    };
  
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
    // Add a marker at the specified latitude and longitude
    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
    });
  }
  

  DownloadReport(): void{
    

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`
    });
    const url = `https://pcee.xyz/service/${this.vehicleId}/?download=true`;

    this.http.get(url, { headers: headers, responseType: 'text' })
    .subscribe(csvData => {
      // Convert CSV data to JSON
      csvtojson().fromString(csvData).then((jsonData: any[]) => {
        console.log(jsonData); // Verify if data is properly converted

        if (jsonData) {
          // Process the data and generate the PDF
          const docDefinition = {
            content: [
              { text: 'Service Data', style: 'header' },
              { text: 'Below is a summary for the services recorded', style: 'header' },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    ['Type', 'next service at', 'last service at', 'mileage', 'service provider', 'cost', 'comment', 'status'],
                    ...jsonData.map(item => [ item.service_type, item.next_service_date, item.last_service_date, item.mileage, item.service_provider, item.cost, item.comment, item.status])
                  ] 
                },
                style: 'data'
              }
            ],
            styles: {
              header: { fontSize: 18, bold: true },
              data: { fontSize: 10, noWrap: false }
            }
          };

          console.log(docDefinition); // Log the docDefinition object
          // Generate the PDF
          pdfMake.createPdf(docDefinition).download('service.pdf');

          // Download CSV
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'service.csv';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }else{
          console.log('No data available to generate PDF');
        }

      });
    });
      

  }
  DownloadRepairReport(): void{
    const docDefinition = {
      content: [
        { text: 'Mechanical Report', style: 'header' },
        { text: 'Date: ' + new Date().toDateString(), style: 'subheader' },
        { text: 'Vehicle Information', style: 'subheader' },
        { text: 'VIN: ____________________',style: 'infoItem'  },
        { text: 'Mileage: ____________________' },
        { text: 'Model: ____________________' },
        { text: 'Transmission: ____________________' },
        { text: 'Engine: ____________________' },
        { text: 'Transmission:', style: 'checkbox' },
        { text: 'Satisfied   Not Satisfied   Somewhat Satisfied' },
        { text: '[ ]              [ ]                [ ] ' },
        { text: 'Lights:', style: 'checkbox' },
        { text: '[ ] Satisfied   [ ] Not Satisfied   [ ] Somewhat Satisfied' },
        { text: 'Suspension:', style: 'checkbox' },
        { text: '[ ] Satisfied   [ ] Not Satisfied   [ ] Somewhat Satisfied' },
        { text: 'Battery:', style: 'checkbox' },
        { text: '[ ] Satisfied   [ ] Not Satisfied   [ ] Somewhat Satisfied' },
        { text: 'Windshield:', style: 'checkbox' },
        { text: '[ ] Satisfied   [ ] Not Satisfied   [ ] Somewhat Satisfied' },
        { text: 'Air Conditioning:', style: 'checkbox' },
        { text: '[ ] Satisfied   [ ] Not Satisfied   [ ] Somewhat Satisfied' },
        { text: 'Inspector Name: ____________________' },
        { text: 'Date: ____________________' },
        { text: 'Comments:', style: 'subheader' },
        { text: '_____________________________________________________________' }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        subheader: {
          fontSize: 18,
          bold: true,
          //margin: [0, 15, 0, 15] // top, right, bottom, left
        },
        checkbox: {
           // Adjust margin as needed
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('mechanical report.pdf');
  }
  
  private stopPolling(): void {
    // Unsubscribe from the polling subscription to avoid memory leaks
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
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