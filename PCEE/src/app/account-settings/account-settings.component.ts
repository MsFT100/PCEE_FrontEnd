import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {

  formData: any = {};
  errorMessage: string | null = null;
  successMessage: any;
  isProfile = false;
  isAccount = true;
  isBot = false;

  //switches
  serviceMaintenance: boolean = false;
  carAnomalies: boolean = false;
  fuelPayment: boolean = false;
  payment: boolean = false;
  subscription: boolean = false;
  systemUpdates: boolean = false;

  isLoading = false;
  constructor(private http: HttpClient,  private router: Router) { }


  ngOnInit(): void {

    this.isLoading = true;
    
    //disable load
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
  onSubmitAccount() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        
      });

      this.http.post('https://www.pcee.xyz/api/account/request-au', this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle added successfully:', response);
            // Reset form and any error message
            //this.resetFormData();
            this.errorMessage = null;
            
            //reload the page
            
            this.router.navigate(['/settings'], { queryParams: { successMessage: 'Vehicle added successfully!' } });
            
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
  onSubmitProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        
      });

      this.http.post('https://www.pcee.xyz/api/account/request-au', this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle added successfully:', response);
            // Reset form and any error message
            //this.resetFormData();
            this.errorMessage = null;
            
            //reload the page
            
            this.router.navigate(['/settings'], { queryParams: { successMessage: 'Vehicle added successfully!' } });
            
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

  onSubmitBot() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Token ${token}`,
        
      });

      this.http.post('https://www.pcee.xyz/api/account/request-au', this.formData, { headers })
        .subscribe(
          response => {
            console.log('Vehicle added successfully:', response);
            // Reset form and any error message
            //this.resetFormData();
            this.errorMessage = null;
            
            //reload the page
            
            this.router.navigate(['/settings'], { queryParams: { successMessage: 'Vehicle added successfully!' } });
            
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
}
