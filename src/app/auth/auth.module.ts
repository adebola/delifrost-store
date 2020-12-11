import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {RegisterComponent} from './register/register.component';
import {SharedModule} from '../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {CommonModule} from '@angular/common';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';


@NgModule({
    declarations: [
        LoginComponent,
        ForgetPasswordComponent,
        RegisterComponent,
        NotAuthorizedComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AuthRoutingModule,
        RecaptchaModule,
        RecaptchaFormsModule
    ]
})
export class AuthModule {
}
