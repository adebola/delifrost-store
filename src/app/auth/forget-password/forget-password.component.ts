import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  public forgotForm: FormGroup;

  constructor(private fb: FormBuilder,
              private toastrService: ToastrService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  onSubmit(form: FormGroup) {

   if (!form.valid) {
     return this.toastrService.error('Please fill in form correctly');
   }
   
   this.authService.generatePasswordResetRequest(form.value.email);
  }

  private createForm() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

  }
}
