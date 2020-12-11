import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthSignInResponseData } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public error: string = null;
  public captchaError = false;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService) { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    if (!form.valid) {
      this.toastrService.error('Please fill out all items in form', 'Validation Error');
      return;
    }

    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      this.captchaError = true;
      return;
    }

    console.log(response);

    this.subscription = this.authService.login(email, password, response)
      .pipe(
        tap(() => this.router.navigate(['/home']))
      ).subscribe(() => grecaptcha.reset());

    form.reset();
  }

  resolved(captchaResponse: string) {
    console.log(captchaResponse);
  }
}
