import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthSignInResponseData } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private closeSub: Subscription;
  isLoading = false;
  error: string = null;


  constructor(private authService: AuthService, private router: Router, private toastrService: ToastrService) { }

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

    this.isLoading = true;

    this.closeSub = this.authService.login(email, password).subscribe((response: AuthSignInResponseData) => {
      this.isLoading = false;
      //console.log(response);
      this.router.navigate(['/shop/collection']);
    }, (errorMessage) => {
      this.isLoading = false;
      this.error = 'An Error has occurred ' + errorMessage;

      this.toastrService.error(errorMessage, 'Authentication Error');

      //console.log(this.error);
    });

    form.reset();
  }
}
