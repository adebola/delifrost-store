import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth/auth.service';
import {User} from '../../../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public profileForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      return this.toastrService.error('The Form has not been completely filled out');
    }

    const user: User = new User(
        0,
        null,
        null,
        form.value.fullname,
        form.value.telephone,
        null, form.value.organization, null, null
    );

    this.authService.updateUser(user);
  }

  private createForm(): void {

    // Load Details from DB
    this.subscription = this.authService.user$.subscribe(user => {
      this.profileForm = this.fb.group({
        fullname: [user.fullName, [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
        organization: [user.organization],
        telephone: [user.telephone, [Validators.required, Validators.minLength(11), Validators.pattern('[0-9]+')]],
        email: [{ value: user.email, disabled: true}, [Validators.required, Validators.email]],
      });
    });


  }
}
