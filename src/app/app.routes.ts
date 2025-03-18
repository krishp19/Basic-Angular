import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home Page
  { path: 'signup', component: SignupComponent }, // Signup Page
  { path: 'login', component: SigninComponent }, // Signup Page
  { path: '**', redirectTo: '' } // Redirect invalid routes to Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
