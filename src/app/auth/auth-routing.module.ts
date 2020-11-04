import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

const routes: Routes = [
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
    path: '401',
    component: NotAuthorizedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}