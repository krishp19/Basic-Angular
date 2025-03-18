import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  menuOpen = false;
  isLoggedIn: boolean = false; // Check login state
  userAvatar: string = 'https://via.placeholder.com/40'; // Default profile image
  username: string = 'Guest'; // Default username
  dropdownOpen: boolean = false; // Dropdown state
  signinForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Check if the user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.username = 'User'; // Ideally, get user info from API
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.http.post('https://dummyjson.com/auth/login', this.signinForm.value).subscribe({
        next: (response: any) => {
          console.log('Login Success:', response);
          localStorage.setItem('authToken', response.token);
          this.isLoggedIn = true;
          this.username = response.username || 'User';
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login Failed:', error);
        },
      });
    }
  }

  logout() {
    console.log('User logged out');
    localStorage.removeItem('authToken'); // Remove token
    this.isLoggedIn = false;
    this.username = 'Guest';
    this.router.navigate(['/signin']); // Redirect to login page
  }
}
