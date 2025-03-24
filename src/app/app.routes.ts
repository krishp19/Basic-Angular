import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './guard/auth.guard';
import { NoAuthGuard } from './guard/no-auth.guard';
import { FormComponent } from './components/form/form.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home Page
  { path: 'signup', component: SignupComponent, canActivate:[NoAuthGuard] }, // Signup Page
  { path: 'login', component: SigninComponent,canActivate:[NoAuthGuard] }, // Signup Page
  { path: 'about', component: AboutComponent, canActivate:[AuthGuard] }, // Redirect invalid routes to Home
  { path: 'contact', component: FormComponent,canActivate:[AuthGuard] },
  { path: 'chat', component: ChatRoomComponent,canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
