import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';

export interface AuthState {
  authToken: string | null;
  user: any;
}

// Check if sessionStorage is available
const isBrowser = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';

const initialState: AuthState = {
  authToken: isBrowser ? sessionStorage.getItem('authToken') || null : null,
  user: isBrowser ? JSON.parse(sessionStorage.getItem('user') || '{}') : null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { authToken, user }) => {
    if (isBrowser) {
      sessionStorage.setItem('authToken', authToken);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    return { ...state, authToken, user };
  }),
  on(logout, () => {
    if (isBrowser) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    }
    return { authToken: null, user: {} };
  })
);
