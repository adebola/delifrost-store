import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    public passwordForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.createForm();
    }

    onSubmit(passwordForm: FormGroup) {

        if (!passwordForm.valid) {
            return this.toastrService.error('Please fill out the form completely correcting any highlighted errors');
        }

        const password = passwordForm.value.password;
        const newpassword1 = passwordForm.value.newpassword1;
        const newpassword2 = passwordForm.value.newpassword2;

        if (newpassword1 !== newpassword2) {
            return this.toastrService.error('Passwords do not match, please try again');
        }

        this.authService.changePassword(password, newpassword1);
    }

    private createForm(): void {

        this.passwordForm = this.fb.group({
            password: ['', [Validators.required]],
            newpassword1: ['', [Validators.required, Validators.minLength(6)]],
            newpassword2: ['', [Validators.required, Validators.minLength(6)]],
        });
    }
}
