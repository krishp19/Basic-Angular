import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true, // Add this line for standalone component
  imports: [RouterOutlet, FormsModule, CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'This is Title';
  user = { name: '', email: '' };

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitForm() {
    console.log(this.myForm.value);
  }
}
