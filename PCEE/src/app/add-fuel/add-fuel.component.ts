import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


interface FuelData{
  
}
@Component({
  selector: 'app-add-fuel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './add-fuel.component.html',
  styleUrl: './add-fuel.component.css'
})
export class AddFuelComponent {
  formData: any = {};
  errorMessage: string | null = null;
  vehicleId: string | null = null;

  currentDate: string | null = null; // Property to hold the current date

  constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      
    ) { }
  

  ngOnInit(): void {
    // Get the vehicle ID from the route parameters
    
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
    });
    this.currentDate = this.getCurrentDate();
    

  }
  getCurrentDate(): string | null {
    // Get the current date in the format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  onSubmit() {
    const token = localStorage.getItem('token');
    // Include the vehicleId in the form data
    

   
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    
    
    if (token) {
      this.formData.vehicle = this.vehicleId;
      console.log(this.formData);
      const url = `https://pcee.xyz/api/vehicles/${this.vehicleId}/fuel`;
  
      this.http.post(url, this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle update request successful:', response);
            // Reset form and any error message
            this.resetFormData();
            this.errorMessage = null;
  
            // Reload the page
            
            this.router.navigate(['/vehicle-detail-view/', this.vehicleId], { queryParams: { successMessage: 'fuel record update request successful!' } });
            

          },
          error => {
            console.error('Failed to request vehicle update:', error);
            if (error && error.error) {
              this.errorMessage = Object.values(error.error).flat().join('\n');
            } else {
              // If the error object doesn't contain specific field errors, display a generic error message
              this.errorMessage = 'Failed to request fuel record update. Please try again.';
            }
          }
        );
    } else {
      console.error('Token is not available.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }
  }
  // Reset the form data
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
}
