import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {catchError, tap} from 'rxjs/operators';
import {QuickTermsViewComponent} from '../../shared/components/modal/quick-terms-view/quick-terms-view.component';

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
    public registerForm: FormGroup;
    public submitted = false;
    @ViewChild('quickTermsView') QuickTermsView: QuickTermsViewComponent;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastrService: ToastrService,
        private fb: FormBuilder) {
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.createForm();
    }

    onSubmit(form: FormGroup) {

        this.submitted = true;

        if (!form.valid) {
            return this.toastrService.error('The Form has not been completely filled out');
        }

        if (form.value.password !== form.value.repeatpassword) {
            return this.toastrService.error('Passwords do not match');
        }

        const response = grecaptcha.getResponse();
        if (response.length === 0) {
            return this.captchaError = true;
        }

        const email = form.value.email;
        const password = form.value.password;
        const fullName = form.value.fullname;
        const telephone = form.value.telephone;
        const address = form.value.address;
        const organization = form.value.organization ? form.value.organization : null;

        this.subscription = this.authService.signup(email, email, password, fullName, telephone, address, organization, response)
            .pipe(
                catchError(() => grecaptcha.reset()),
                tap(() => {
                    this.router.navigate(['/auth/login']);
                    this.toastrService.info('You have been registered successfully, DELIFROST Admin will activate your account to grant you access');
                })
            ).subscribe(() => grecaptcha.reset());
    }

    resolved($event: string) {}

    private createForm(): void {
        this.registerForm = this.fb.group({
            fullname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            organization: [''],
            telephone: ['', ],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatpassword: ['', [Validators.required, Validators.minLength(6)]],
            address: ['', [Validators.required, Validators.maxLength(200)]],
            acceptTerms: [false, Validators.requiredTrue]
        });
    }
}
