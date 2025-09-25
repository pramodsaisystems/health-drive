// angular import
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { jwtDecode } from 'jwt-decode';
import { PrivacyPolicyModalComponent } from './modal/policy.component';
import { CommonModule } from '@angular/common';

import { ResetPasswordComponent } from './component/reset-pwd.component';
import { TFAScreenComponent } from './component/tfa-screen/tfa-screen.component';
import { TFAAuthComponent } from './component/tfa-screen/tfa-auth.component';
import { DataSharingService } from 'src/utils/broadcast-service';
import { CookieService } from 'ngx-cookie-service';
import { DeviceService } from 'src/utils/device.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    NzButtonComponent,
    NzInputDirective,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzCheckboxModule,
    PrivacyPolicyModalComponent,
    CommonModule,

    ResetPasswordComponent,
    TFAScreenComponent,
    TFAAuthComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  showPwd = false;
  isPMVisible = false;
  showResetPass = false;
  isTFA = false;
  QRImage: string = '';
  key: string = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private message: NzMessageService,
    private dataSharingService: DataSharingService,
    private cookieService: CookieService,
    private deviceService: DeviceService
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      hippa: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {
    this.getDeviceId();
  }

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    hippa: FormControl<boolean>;
  }>;

  getDeviceId = async () => {
    let res: any = await this.deviceService.getDeviceId();
    if (res) {
      localStorage.setItem('LoginDeviceId', res);
    }
  };
  submitForm = async () => {
    if (this.validateForm.valid) {
      let res: any = await post(APP_API_URL + 'Auth/Login', {
        email: this.validateForm.value.userName,
        password: this.validateForm.value.password
      });

      if (res?.status === 200 && res?.data?.isSuccess) {
        this.message.create('success', res.data.message);
        const tokenInfo = this.getDecodedAccessToken(res.data.data.token);
        localStorage.setItem('userInfo', JSON.stringify(tokenInfo));
        localStorage.setItem('isLoggedIn', 'yes');
        localStorage.setItem('exp', tokenInfo.exp);
        localStorage.setItem('idle', tokenInfo.SessionTimeout);
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('userLoginInfoId', res.data.data.userLoginInfoId);
        localStorage.setItem('refreshToken', res.data.data.refreshToken);
        localStorage.setItem('currentUserId', tokenInfo.UserId);
        localStorage.setItem('clientId', tokenInfo.ClientId);
        localStorage.setItem('role', tokenInfo.role);
        localStorage.setItem('abbr', tokenInfo.ClientAbbreviation);
        // this.cookieService.set('MFA_TrustedDevice', 'Hello World');
        if (res?.data?.isTFAEnabled && res?.data?.isTFARegistered) {
          this.dataSharingService.updateRegTFAD('yes');
          localStorage.setItem('regTFA', 'yes');
        }
        this.router.navigate(['/']);
      } else if (res?.status === 200 && res?.data?.isTFAEnabled) {
        if (!res?.data?.isTFARegistered) {
          this.key = res?.data?.data?.manualEntryKey;
          this.QRImage = res?.data?.data?.qrCodeSetupImageUrl;
        } else if (res?.data?.isTFARegistered) {
          // localStorage.setItem('TFAReg', 'yes');

          this.dataSharingService.updateRegTFAD('yes');
          localStorage.setItem('regTFA', 'yes');
        }

        this.isTFA = true;
      } else {
        this.message.create('error', res?.data?.message);
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

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  onShowPwd = (e) => {
    this.showPwd = !e;
  };

  onClosePrivacyModal = (e) => {
    this.isPMVisible = false;
    if (e) {
      this.validateForm.patchValue({ hippa: true });
    }
  };

  onPolicyClick = () => {
    this.isPMVisible = true;
  };

  showResetPassword = () => {
    this.showResetPass = true;
  };

  onSuccessVerify = () => {};

  onBackClick = () => {
    this.isTFA = false;
  };

  onCancelClick = () => {
    this.showResetPass = false;
  };
}
