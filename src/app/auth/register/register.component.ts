import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';

declare var grecaptcha: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

    public captchaError = false;
    public error: string = null;
    private subscription: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastrService: ToastrService) {
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
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

        const response = grecaptcha.getResponse();
        if (response.length === 0) {
            this.captchaError = true;
            return;
        }

        const email = form.value.email;
        const password = form.value.password;
        const fullName = form.value.fullname;
        const telephone = form.value.telephone;
        const address = form.value.address;
        const organization = form.value.organization ? form.value.organization : null;

        this.subscription = this.authService.signup(email, email, password, fullName, telephone, address, organization, response)
            .pipe(
                tap(() => this.router.navigate(['/auth/login']))
            ).subscribe(() => grecaptcha.reset());

        form.reset();
    }

    resolved($event: string) {
        console.log($event);
    }
}
