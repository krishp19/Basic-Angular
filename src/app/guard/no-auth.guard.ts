import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.reducer';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private store: Store<{ auth: AuthState }>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select((state) => state.auth).pipe(
      map((authState) => {
        const isLoggedIn = !!authState.authToken; // Check if token exists
        if (isLoggedIn) {
          this.router.navigate(['/']); // Redirect logged-in users to dashboard
          return false;
        }
        return true;
      })
    );
  }
}
