export interface AuthState {
    authToken: string | null;
  }
  
  export const initialAuthState: AuthState = {
    authToken: null,
  };
  