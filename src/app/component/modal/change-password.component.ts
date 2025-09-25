import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'change-pwd-modal',

  templateUrl: './change-password.component.html'
})
export class ChangePasswordModalComponent {
  @ViewChild('myInput') myInput!: ElementRef;

  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      currentPassword: ['', [Validators.required, this.passwordValidator]],
      newPassword: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required, this.confirmationValidator]]
    });
  }
  @Input() isVisible = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  showCurrPwd = false;
  showPwd = false;
  showConfPwd = false;
  validateForm: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;

    confirmPassword: FormControl<string>;
  }>;

  ngOnChanges() {}
  handleOk(): void {
    this.closeModalEvent.emit(false);
  }

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

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
    } else if (control.value !== this.validateForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  updateConfirmValidator1 = async () => {
    Promise.resolve().then(() => this.validateForm.controls.confirmPassword.updateValueAndValidity());
  };

  updateConfirmValidator2 = async () => {
    Promise.resolve().then(() => this.validateForm.controls.currentPassword.updateValueAndValidity());
  };
  submitForm = async () => {
    if (this.validateForm.valid) {
      let currentUserId = localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : '0';
      let res: any = await post(APP_API_URL + 'Users/ChangePassword', {
        userId: currentUserId,
        currentPassword: this.validateForm.value.currentPassword,
        newPassword: this.validateForm.value.newPassword,
        confirmPassword: this.validateForm.value.confirmPassword
      });
      if (res?.status === 204) {
        this.message.create('success', 'Password updated successfully!');
        this.closeModalEvent.emit(true);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/guest/login']);
      } else if (res?.status === 400) {
        this.message.create(
          'error',
          res?.response?.data?.statusMessage ? res?.response?.data?.statusMessage : 'Error while updating password!'
        );
      } else {
        this.message.create('error', 'Error while updating password!');
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

  onShowPwd1 = (e) => {
    this.showPwd = !e;
  };

  onShowCurrPwd = (e) => {
    this.showCurrPwd = !e;
  };

  onShowConfPwd = (e) => {
    this.showConfPwd = !e;
  };
}
