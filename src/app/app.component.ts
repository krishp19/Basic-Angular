import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthState } from './store/auth/auth.reducer';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ Standalone component setup
  imports: [
    RouterOutlet, 
    FormsModule, 
    CommonModule, 
    ReactiveFormsModule, 
    NavbarComponent, 
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // ✅ Corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'This is Title';
  user = { name: '', email: '' };

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  authState$: Observable<AuthState>; // ✅ Define type properly

  constructor(private store: Store<{ auth: AuthState }>) {
    this.authState$ = this.store.select('auth');

    // ✅ Log the store state to confirm authToken is stored
    this.authState$.subscribe(state => console.log('Auth Store State:', state));
  }

  submitForm() {
    console.log(this.myForm.value);
  }
}
