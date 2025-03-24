import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/auth/auth.actions';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Auth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';

interface AuthResponse {
  authToken: string;
  user?: any;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;

  private http = inject(HttpClient);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);

  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.signupForm.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this),
    ]);
  }

  passwordMatchValidator(control: any) {
    return control.value === this.signupForm?.get('password')?.value
      ? null
      : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = {
      fullName: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    this.http.post<AuthResponse>('http://localhost:3001/api/auth/signup', formData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.store.dispatch(
          loginSuccess({
            authToken: response.authToken,
            user: response.user || {},
          })
        );
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('user', JSON.stringify(response.user || {}));
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.errorMessage = 'Signup failed! Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  async googleSignUp() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        console.log('Google Signup Success:', result.user);
        const userData = {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          uid: result.user.uid,
        };

        localStorage.setItem('authToken', await result.user.getIdToken());
        localStorage.setItem('user', JSON.stringify(userData));
        this.store.dispatch(loginSuccess({ authToken: await result.user.getIdToken(), user: userData }));
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Google Signup Failed:', error);
      this.errorMessage = 'Google sign-up failed. Please try again.';
    }
  }

  async githubSignUp() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        console.log('GitHub Signup Success:', result.user);
        const userData = {
          name: result.user.displayName || result.user.email?.split('@')[0],
          email: result.user.email,
          photo: result.user.photoURL || 'https://github.com/github.png',
          uid: result.user.uid,
        };

        localStorage.setItem('authToken', await result.user.getIdToken());
        localStorage.setItem('user', JSON.stringify(userData));
        this.store.dispatch(loginSuccess({ authToken: await result.user.getIdToken(), user: userData }));
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('GitHub Signup Failed:', error);
      this.errorMessage = 'GitHub sign-up failed. Please try again.';
    }
  }
}