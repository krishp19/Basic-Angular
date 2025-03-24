import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, // For form fields
    MatInputModule,     // For inputs and textarea
    MatButtonModule,    // For the submit button
    MatCardModule       // For the card container
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  contactForm: FormGroup;
  authToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store<{ auth: AuthState }>
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.store.select((state) => state.auth).subscribe((authState) => {
      this.authToken = authState.authToken;
    });
  }

  submitForm() {
    if (this.contactForm.invalid) {
      return;
    }

    const formData = this.contactForm.value;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken || 'test-token'}`,
      'Content-Type': 'application/json',
    });

    this.http.post('https://jsonplaceholder.typicode.com/posts', formData, { headers }).subscribe({
      next: (response) => {
        console.log('Form submitted successfully!', response);
        alert('Your message has been sent (Test API).');
        this.contactForm.reset();
      },
      error: (error) => {
        console.error('Error submitting form:', error);
        alert('Something went wrong. Please try again.');
      },
    });
  }
}