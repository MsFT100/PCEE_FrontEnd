import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SigninResponse {
  token: string;
}

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ 
    FormsModule, 
    CommonModule
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  formData: any = {};
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<SigninResponse>('https://pcee.xyz/api/login/', this.formData)
      .subscribe(
        response => {
          console.log('Sign-in successful!', response);
          // Save token to local storage or session storage
          localStorage.setItem('token', response.token);

          // Redirect to dashboard or any other page after successful sign-in
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Sign-in failed!', error);
          // Check if the error response contains specific error messages
          if (error && error.error) {
            // Concatenate all error messages into one string
            this.errorMessage = Object.values(error.error).flat().join('\n');
          } else {
            // If there are no specific error messages, display a generic error message
            this.errorMessage = 'An error occurred during sign-in. Please try again later.';
          }
        }
      );
  }
}
