import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthSignInResponseData } from 'src/app/auth/auth.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public captchaError = false;
  private subscription: Subscription;
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService) { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.createForm();
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      return this.toastrService.error('Please fill out all items properly in the form', 'Validation Error');
    }

    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      return this.captchaError = true;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.subscription = this.authService.login(email, password, response)
      .pipe(
          catchError(() => grecaptcha.reset()),
          tap(() => this.router.navigate(['/home']))
      ).subscribe(() => grecaptcha.reset());
  }

  resolved(captchaResponse: string) {
    console.log(captchaResponse);
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
}
