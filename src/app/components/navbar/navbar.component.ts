import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userAvatar: string = 'https://via.placeholder.com/40';
  username: string = 'Guest';
  dropdownOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.isLoggedIn = true;
        this.username = 'User';
      }
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.isLoggedIn = false;
    this.username = 'Guest';
    this.router.navigate(['/signin']);
  }
}
