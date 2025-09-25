import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [
    NzFormModule,
    NzButtonComponent,
    CommonModule,
    NgxOtpInputComponent,
    NzButtonComponent,

    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzInputModule
  ],
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['../login.component.scss']
})
export class ResetPasswordComponent {
  @Input() email = '';
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() onCancelClick = new EventEmitter<any>();
  otpOptions: NgxOtpInputComponentOptions = { otpLength: 6 };
  screen: string = 'email';
  showPwd = false;
  showConfPwd = false;
  otpValue: string = '';
  otpErr: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    });
    this.validateForm1 = this.fb.group({
      newPassword: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required, this.confirmationValidator]]
    });
  }

  validateForm: FormGroup<{
    email: FormControl<string>;
  }>;

  validateForm1: FormGroup<{
    newPassword: FormControl<string>;

    confirmPassword: FormControl<string>;
  }>;

  ngOnInit() {
    if (this.email) {
      this.validateForm.patchValue({
        email: this.email
      });
    }
  }

  submitForm = async () => {
    if (this.validateForm.valid) {
      let res: any = await post(APP_API_URL + 'Users/ForgotPasswordSendEmailOTP', {
        emailId: this.validateForm.value.email
      });

      if (res?.status === 204) {
        this.screen = 'otp';
        this.message.create('success', res?.data?.message ? res?.data?.message : 'OTP sent successfully!');
      } else {
        this.message.create('error', res?.response?.data ? res?.response?.data : 'Error occured while sending OTP.');
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  };

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Regex for strong password
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isValidLength) {
      return { passwordStrength: true }; // Return error if password does not meet criteria
    }

    return null;
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm1.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  updateConfirmValidator1 = async () => {
    Promise.resolve().then(() => this.validateForm1.controls.confirmPassword.updateValueAndValidity());
  };

  onShowPwd1 = (e) => {
    this.showPwd = !e;
  };

  onShowConfPwd = (e) => {
    this.showConfPwd = !e;
  };

  submitForm1 = async () => {
    if (this.validateForm1.valid) {
      let res: any = await post(APP_API_URL + 'Users/ResetPassword', {
        userId: 0,
        emailId: this.validateForm.value.email,
        newPassword: this.validateForm1.value.newPassword,
        confirmPassword: this.validateForm1.value.confirmPassword
      });

      if (res?.status === 204) {
        this.message.create('success', res?.data?.message ? res?.data?.message : 'Password reset successfully!');
        setTimeout(() => {
          this.onCancelClick.emit();
        }, 2000);
      } else {
        this.message.create(
          'error',
          res?.response?.data?.message ? res?.response?.data?.message : 'Error occured while updating password.'
        );
      }
    } else {
      Object.values(this.validateForm1.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  };

  onOtpChange(event) {
    this.otpValue = event.toString().replaceAll(',', '');
    this.otpErr = this.otpValue.length === 0;
  }

  otpComplete(event) {
    this.otpValue = event;
    this.onVerifyOTP();
  }

  onVerifyOTP = async () => {
    if (this.otpValue.length === 6) {
      this.otpErr = false;
      let res: any = await post(APP_API_URL + 'Users/ForgotPasswordVerifyEmailOTP', {
        emailId: this.validateForm.value.email,
        otp: this.otpValue
      });

      if (res?.status === 204) {
        this.screen = 'pwd';
        this.message.create('success', res?.data?.message ? res?.data?.message : 'OTP verified successfully!');
      } else {
        this.message.create('error', res?.response?.data?.message ? res?.response?.data?.message : 'Error occured while verifying OTP.');
      }
    } else {
      this.otpErr = true;
    }
  };

  onResendOTP = () => {
    this.submitForm();
  };

  onEvtCancelClick = () => {
    this.onCancelClick.emit();
  };
}
