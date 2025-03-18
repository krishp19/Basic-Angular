import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  private http = inject(HttpClient); // Inject HttpClient

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      this.http.post('https://jsonplaceholder.typicode.com/posts', formData).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          alert('Signup successful!');
        },
        error: (error) => {
          console.error('Signup failed:', error);
          alert('Signup failed! Please try again.');
        }
      });
    }
  }
}
