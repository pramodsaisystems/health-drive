import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions, NgxOtpStatus } from 'ngx-otp-input';
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
import { jwtDecode } from 'jwt-decode';
import { RouterModule, Router } from '@angular/router';
import { DataSharingService } from 'src/utils/broadcast-service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'tfa-auth',
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
  templateUrl: './tfa-auth.component.html',
  styleUrls: ['../../login.component.scss']
})
export class TFAAuthComponent {
  @Input() QRImage = '';
  @Input() key = '';
  @Input() email = '';
  @Input() password = '';
  @Input() isloginpage = false;

  @Output() onSuccessVerify = new EventEmitter<boolean>();
  @ViewChild('otpInput') otpInput: NgxOtpInputComponent;
  otpOptions: NgxOtpInputComponentOptions = { otpLength: 6 };
  status: NgxOtpStatus;
  otpValue: string = '';
  otpErr: boolean = false;
  constructor(
    private message: NzMessageService,
    private router: Router,
    private dataSharingService: DataSharingService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    console.log(this.isloginpage);
  }

  onOtpChange(event) {
    this.otpValue = event.toString().replaceAll(',', '');
    this.otpErr = this.otpValue.length === 0;
  }

  otpComplete(event) {
    this.otpValue = event;
    this.onContinueClick();
  }

  onContinueClick = async () => {
    if (this.otpValue.length === 6) {
      this.otpErr = false;
      let url = APP_API_URL + (this.isloginpage ? 'Auth/Verify2FAPasscode' : 'Users/Verify2FA');
      let res: any = await post(
        url,
        this.isloginpage
          ? {
              email: this.email ? this.email : '',
              password: this.password ? this.password : '',
              passcode: this.otpValue
            }
          : {
              userId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : '0',
              email: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).EmailId : '',
              passcode: this.otpValue
            }
      );

      if (res?.status === 200 && (res?.data?.isSuccess || res?.data?.isVrified)) {
        this.message.create('success', res?.data?.message);
        if (this.isloginpage) {
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
          this.router.navigate(['/']);
        }

        setTimeout(() => {
          this.onSuccessVerify.emit();
          this.dataSharingService.updateRegTFAD('yes');
          localStorage.setItem('regTFA', 'yes');
        }, 5000);
      } else if (res?.status === 200 && (!res?.data?.isSuccess || !res?.data?.isVrified)) {
        this.message.create('error', res?.data?.message);
      } else {
        this.message.create('error', res?.response?.data?.message);
      }
    } else {
      this.otpErr = true;
      // this.message.create('error', 'OTP length is not matching');
    }
  };

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
