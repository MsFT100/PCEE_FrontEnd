import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


// Define interfaces for response structure
interface UserInfo {
  id: string;
  username: string;
  email: string;
}

interface SignupResponse {
  "User Info": UserInfo;
  token: string;
}
interface SignupErrorResponse {
  // Define properties for error messages
  username?: string[];
  email?: string[];
  // Add more properties for other fields if needed
}
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ 
    FormsModule,
    CommonModule
],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  formData: any = {};
  errorMessage: string | null = null;
  

  constructor(private http: HttpClient, private router: Router) {}
 
  onSubmit() {
    this.http.post<SignupResponse>('https://pcee.xyz/api/register/', this.formData)
      .subscribe(
        response => {
          console.log('Signup successful!', response);
          // Save user info and token to local storage or session storage
          localStorage.setItem('userInfo', JSON.stringify(response["User Info"]));
          localStorage.setItem('token', response.token);

          // Redirect to dashboard or any other page after successful signup
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Signup failed!', error);
          // Check if the error response contains specific error messages
          if (error && error.error) {
            // Concatenate all error messages into one string
            this.errorMessage = Object.values(error.error).flat().join('\n');
          } else {
            // If there are no specific error messages, display a generic error message
            this.errorMessage = 'An error occurred during signup. Please try again later.';
          }
        }
      );
  }
}
