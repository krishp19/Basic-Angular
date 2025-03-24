import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Use RouterLink instead of RouterModule
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, // For navigation links
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}