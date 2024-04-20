import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';


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
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css'
})


export class VehicleFormComponent {
  formData: any = {};

  errorMessage: string | null = null;

  constructor(private http: HttpClient,  private router: Router) { }

  onSubmit() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        
      });

      this.http.post<VehicleFormErrorData>('https://pcee.xyz/api/vehicles/', this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle added successfully:', response);
            // Reset form and any error message
            this.resetFormData();
            this.errorMessage = null;
            
            //send the user to the vehicle list page
            this.router.navigate(['/vehicle'], { queryParams: { successMessage: 'Vehicle added successfully!' } });
            
          },
          error => {
            console.error('Failed to add vehicle:', error);
            if (error && error.error) {
              this.errorMessage = Object.values(error.error).flat().join('\n');
            } else {
              // If the error object doesn't contain specific field errors, display a generic error message
              this.errorMessage = 'Failed to add vehicle. Please try again.';
            }
          }
        );
        } else {
          console.error('Token is not available.');
          this.router.navigate(['/login']);
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
