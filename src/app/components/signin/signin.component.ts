import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/auth/auth.actions';
import { Auth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signin',
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
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  menuOpen = false;
  userAvatar: string = 'https://default-avatar-url.png';
  username: string = 'Guest';
  dropdownOpen: boolean = false;
  signinForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isBrowser: boolean;
  showPassword: boolean = false;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    if (this.isBrowser) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        this.isLoggedIn$.next(true);
        this.username = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')?.name || 'User';
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signinForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password, rememberMe } = this.signinForm.value;

    this.http.post('http://localhost:3001/api/auth/login', { email, password }).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);
        this.store.dispatch(loginSuccess({ authToken: response.access_token, user: response.user }));

        if (this.isBrowser) {
          if (rememberMe) {
            localStorage.setItem('authToken', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            sessionStorage.setItem('authToken', response.access_token);
            sessionStorage.setItem('user', JSON.stringify(response.user));
          }
        }

        this.isLoggedIn$.next(true);
        this.username = response.user.name || 'User';
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login Failed:', error);
        this.errorMessage = error.status === 401 ? 'Invalid credentials. Please check your email and password.'
                        : error.status === 500 ? 'Server error. Please try again later.'
                        : 'Something went wrong. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        console.log('Google Login Success:', result.user);
        
        const userData = {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          uid: result.user.uid,
        };

        localStorage.setItem('authToken', await result.user.getIdToken());
        localStorage.setItem('user', JSON.stringify(userData));

        this.store.dispatch(loginSuccess({ authToken: await result.user.getIdToken(), user: userData }));

        this.isLoggedIn$.next(true);
        this.username = userData.name || 'User';
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Google Login Failed:', error);
      this.errorMessage = 'Google sign-in failed. Please try again.';
    }
  }

  async githubSignIn() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);

      if (result.user) {
        console.log('GitHub Login Success:', result.user);
        
        const userData = {
          name: result.user.displayName || result.user.email?.split('@')[0],
          email: result.user.email,
          photo: result.user.photoURL || 'https://github.com/github.png',
          uid: result.user.uid,
        };

        localStorage.setItem('authToken', await result.user.getIdToken());
        localStorage.setItem('user', JSON.stringify(userData));

        this.store.dispatch(loginSuccess({ authToken: await result.user.getIdToken(), user: userData }));

        this.isLoggedIn$.next(true);
        this.username = userData.name || 'User';
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('GitHub Login Failed:', error);
      this.errorMessage = 'GitHub sign-in failed. Please try again.';
    }
  }

  logout() {
    console.log('User logged out');

    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    }

    this.store.dispatch({ type: '[Auth] Logout' });
    this.isLoggedIn$.next(false);
    this.username = 'Guest';
    this.router.navigate(['/signin']);
  }
}