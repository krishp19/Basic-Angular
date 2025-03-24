import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { logout } from '../../store/auth/auth.actions';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  animations: [
    trigger('slideInOut', [
      state('out', style({
        transform: 'translateX(100%)',
        opacity: 0,
      })),
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1,
      })),
      transition('out => in', [
        animate('300ms ease-in'),
      ]),
      transition('in => out', [
        animate('300ms ease-out'),
      ]),
    ]),
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userAvatar: string = 'https://via.placeholder.com/40';
  username: string = 'Guest';
  dropdownOpen: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private store: Store<{ auth: AuthState }>
  ) {}

  ngOnInit() {
    this.store.select((state) => state.auth).subscribe((authState) => {
      this.isLoggedIn = !!authState.authToken;
      this.username = this.isLoggedIn ? authState.user?.name || 'User' : 'Guest';
      this.userAvatar = this.isLoggedIn
        ? authState.user?.avatar || 'https://imgs.search.brave.com/ZgtYo8Of_XzphnV5zCWGuDV6Zs69zB7ItgIUU8NfzgM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9hdmF0YXIt/ZGVmYXVsdC1pY29u/LTk4OHgxMDI0LXpz/ZmJvcWw1LnBuZw'
        : 'https://imgs.search.brave.com/ZgtYo8Of_XzphnV5zCWGuDV6Zs69zB7ItgIUU8NfzgM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9hdmF0YXIt/ZGVmYXVsdC1pY29u/LTk4OHgxMDI0LXpz/ZmJvcWw1LnBuZw';
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/signin']);
  }
}