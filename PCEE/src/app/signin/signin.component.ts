import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SigninResponse {
  token: string;
}

interface ErrorResponse {
  username?: string[];
  password?: string[];
  non_field_errors?: string[];
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

  togglePasswordVisibility(event: any) {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = event.target.checked ? 'text' : 'password';
  }

  onSubmit() {
    this.http.post<SigninResponse>('https://pcee.xyz/api/login/', this.formData)
      .subscribe(
        (response: SigninResponse) => {
          console.log('Sign-in successful!', response);
          // Save token to local storage or session storage
          localStorage.setItem('token', response.token);

          // Redirect to dashboard or any other page after successful sign-in
          this.router.navigate(['/dashboard']);
        },
        (error: HttpErrorResponse) => {
          console.error('Sign-in failed!', error);
          if (error && error.error) {
            const errorResponse: ErrorResponse = error.error;
            if (errorResponse.non_field_errors) {
              this.errorMessage = errorResponse.non_field_errors.join('\n');
            } else {
              let errorMessage = '';
              if (errorResponse.username) {
                errorMessage += 'Username: ' + errorResponse.username.join('\n') + '\n';
              }
              if (errorResponse.password) {
                errorMessage += 'Password: ' + errorResponse.password.join('\n') + '\n';
              }
              this.errorMessage = errorMessage;
            }
          } else {
            this.errorMessage = 'An error occurred during sign-in. Please try again later.';
          }
        }
      );
  }
}
