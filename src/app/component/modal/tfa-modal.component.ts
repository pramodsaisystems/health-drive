import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tfa-modal',
  templateUrl: './tfa-modal.component.html'
})
export class TFAModalComponent {
  showPwd = false;
  showTFA = false;
  QRImage: string = '';
  key: string = '';
  @Input() isVisible = false;
  @Input() mfaEnabled = false;

  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
      enableTFA: [true, [Validators.requiredTrue]]
    });
  }

  validateForm: FormGroup<{
    password: FormControl<string>;
    enableTFA: FormControl<boolean>;
  }>;
  ngOnChanges() {}
  handleOk(): void {
    this.closeModalEvent.emit(false);
  }

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  submitForm = async () => {
    if (this.validateForm.valid) {
      let res: any = await post(APP_API_URL + 'Users/SetupTFACode', {
        userId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0,
        password: this.validateForm.value.password,
        isTFARegistered: this.validateForm.value.enableTFA
      });

      if (res?.status === 201) {
        this.QRImage = res?.data?.qrCodeSetupImageUrl;
        this.key = res?.data?.manualEntryKey;
        this.showTFA = true;
        //   this.message.create('success', res.data.message);
        //   const tokenInfo = this.getDecodedAccessToken(res.data.data.token);
        //   localStorage.setItem('userInfo', JSON.stringify(tokenInfo));
        //   localStorage.setItem('isLoggedIn', 'yes');
        //   localStorage.setItem('exp', tokenInfo.exp);
        //   localStorage.setItem('token', res.data.data.token);
        //   localStorage.setItem('userLoginInfoId', res.data.data.userLoginInfoId);
        //   localStorage.setItem('currentUserId', tokenInfo.UserId);
        //   localStorage.setItem('clientId', tokenInfo.ClientId);
        //   localStorage.setItem('role', tokenInfo.role);
        //   localStorage.setItem('abbr', tokenInfo.ClientAbbreviation);
        //   this.router.navigate(['/']);
      } else {
        this.message.create('error', res?.response?.data?.message ? res?.response?.data?.message : 'Error while TFA setup.');
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

  onShowPwd = (e) => {
    this.showPwd = !e;
  };

  onSuccessVerify = () => {
    this.closeModalEvent.emit();
  };
}
