import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { loginSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Auth] Login'), // Listen for login action
      switchMap(({ email, password }) =>
        this.http.post('http://localhost:3001/api/auth/login', { email, password }).pipe(
          map((response: any) => loginSuccess({ authToken: response.access_token, user: response.user })),
          tap((response) => {
            sessionStorage.setItem('authToken', response.authToken);
            sessionStorage.setItem('user', JSON.stringify(response.user));
            this.router.navigate(['/dashboard']);
          }),
          catchError((error) => {
            console.error('Login Failed:', error);
            return of({ type: '[Auth] Login Failed', error });
          })
        )
      )
    )
  );
}
