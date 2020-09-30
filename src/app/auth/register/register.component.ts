import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, throwError } from 'rxjs';
import { AuthService, AuthSignUpResponseData } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/components/loading-spinner/loading.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  private closeSub: Subscription;
  error: string = null;

  constructor(
    private authService: AuthService,
    private loading: LoadingService,
    private router: Router,
    private toastrService: ToastrService) { }

  ngOnDestroy(): void {
     if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (form.value.password !== form.value.repeatpassword) {
      this.toastrService.error('Passwords do not match');
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    const fullName = form.value.fullname;
    const telephone = form.value.telephone;
    const address = form.value.address;

    const register$ = this.authService.signup(email, email, password, fullName, telephone, address)
      .pipe(
        catchError(err => {
          const message = 'Registration Error, please try again';
          this.toastrService.error(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(() =>  this.router.navigate(['/auth/login']))
      );

    this.loading.showLoaderUntilCompleted(register$)
      .subscribe();

    form.reset();
  }
}
