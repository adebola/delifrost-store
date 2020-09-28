import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, AuthSignUpResponseData } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

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

    if (!form.valid) {
      return;
    }

    if (form.value.password !== form.value.repeatpassword) {
      this.toastrService.error('Passwords do not match');
      return;
    }

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;
    const fullName = form.value.fullname;
    const telephone = form.value.telephone;
    const address = form.value.address;

    this.authService.signup(email, email, password, fullName, telephone, address).subscribe((response: AuthSignUpResponseData) => {
      this.isLoading = false;
      this.toastrService.info(response.message);
      this.router.navigate(['/auth/login']);
    }, (errorMessage) => {
      this.isLoading = false;
      this.error = 'An Error has occurred : ' + errorMessage;
      this.toastrService.error(this.error);
    });

    form.reset();
  }
}
