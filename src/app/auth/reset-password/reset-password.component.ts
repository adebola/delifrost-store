import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute} from '@angular/router';
import {User} from '../user.model';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    public resetForm: FormGroup;
    public token: string;
    private subscribtion: Subscription;
    public user: User;


    constructor(private fb: FormBuilder,
                private toastrService: ToastrService,
                private route: ActivatedRoute,
                public authService: AuthService) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        this.createForm();


        if (this.token) {
            console.log('TOKEN', this.token);
            this.subscribtion = this.authService.getResetToken(this.token).subscribe(user => {
                this.user = user;
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscribtion) {
            this.subscribtion.unsubscribe();
        }
    }

    onSubmit(form: FormGroup) {

        if (!form.valid) {
            console.log(form);
            return this.toastrService.error('Please fill in form correctly');
        }

        const password: string = form.value.password;
        const repeatpassword: string = form.value.repeatpassword;

        if (password !== repeatpassword) {
            return this.toastrService.error('Passwords do not match please try again!')
        }

        this.authService.changeTokenPassword(this.token, password);
    }

    private createForm() {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatpassword: ['', [Validators.required, Validators.minLength(6)]],
        });
    }
}
