import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  formData: any = {};

  errorMessage: string | null = null;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    
  ) { }
  onSubmit() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    
    
    if (token) {
      
      console.log(this.formData);
      const url = `https://www.pcee.xyz/support/email/`;
  
      this.http.post(url, this.formData, { headers })
        .subscribe(
          response => {
            console.log('successful:', response);
            // Reset form and any error message
            
            this.errorMessage = null;
  
            // Reload the page
            
            this.router.navigate(['/dashboard'], { queryParams: { successMessage: 'Well get back to you Soon!' } });
            

          },
          error => {
            console.error('Failed', error);
            if (error && error.error) {
              this.errorMessage = Object.values(error.error).flat().join('\n');
            } else {
              // If the error object doesn't contain specific field errors, display a generic error message
              this.errorMessage = 'Failed. Please try again.';
            }
          }
        );
    } else {
      console.error('Token is not available.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    }

  }
}
