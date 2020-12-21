import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgotpassword',
    component: ForgetPasswordComponent,
  },
  {
    path: 'forgotpassword/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '401',
    component: NotAuthorizedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
