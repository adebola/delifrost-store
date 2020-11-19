import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthSignInResponseData } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/components/loading-spinner/loading.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

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
    const email = form.value.email;
    const password = form.value.password;

    if (!form.valid) {
      this.toastrService.error('Please fill out all items in form', 'Validation Error');
      return;
    }

    const login$ = this.authService.login(email, password)
      .pipe(
        catchError(err => {
          const message = 'Authentication Error, please try again';
          this.toastrService.error(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(() => this.router.navigate(['/home']))
      );

    this.loading.showLoaderUntilCompleted(login$)
      .subscribe();

    form.reset();
  }
}
