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
      debugger;
      // let res: any = await post(APP_API_URL + 'Auth/Login', {
      //   email: this.validateForm.value.userName,
      //   password: this.validateForm.value.password
      // });

      let res = {
        data: {
          isSuccess: true,
          isTFAEnabled: false,
          isTFARegistered: false,
          message: '',
          data: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxIiwiSW50ZXJuYWxVc2VySWQiOiIxIiwiRmlyc3ROYW1lIjoiU2Fpc3lzdGVtcyBzIiwiTGFzdE5hbWUiOiJIZWFsdGgiLCJFbWFpbElkIjoiYWRtaW5Ac2Fpc3lzdGVtc2hlYWx0aC5jb20iLCJVc2VyTmFtZSI6ImFkbWluQHNhaXN5c3RlbXNoZWFsdGguY29tIiwiRG9iIjoiIiwiR2VuZGVyIjoiIiwiQ2xpZW50SWQiOiIxNyIsIkNsaWVudEFiYnJldmlhdGlvbiI6IkRFTU8iLCJqdGkiOiIyMWQ0MjM5NC1kNmNjLTRmOTgtODY2YS0wNDBlODY4ZGM4MzIiLCJBc3NpZ25lZFN0YXRlcyI6IiIsIkFzc2lnbmVkU2VydmljZUxvY2F0aW9ucyI6IiIsIkFzc2lnbmVkUHJvdmlkZXJzIjoiIiwiU2Vzc2lvblRpbWVvdXQiOiIyMCIsInJvbGUiOiJTdXBlciBBZG1pbiIsIlVzZXJyb2xlSWQiOiIxIiwibmJmIjoxNzYwMDEyNjg1LCJleHAiOjE3NjAwOTkwODQsImlhdCI6MTc2MDAxMjY4NX0.Nc0fJHXfJqyga7OrREOFj6w5jk0IeLSVJXYoG2I1_Ac',
            refreshToken: '030ce543-9ef1-4536-8f0d-b7e3bbd1fb24',
            userLoginInfoId: 'fb7173f3-d26f-4b86-a099-13324bb07371',
            dayShiftStart: null,
            dayShiftEnd: null
          }
        },
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json; charset=utf-8'
        },
        config: {
          transitional: {
            silentJSONParsing: true,
            forcedJSONParsing: true,
            clarifyTimeoutError: false
          },
          adapter: ['xhr', 'http', 'fetch'],
          transformRequest: [null],
          transformResponse: [null],
          timeout: 0,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          maxContentLength: -1,
          maxBodyLength: -1,
          env: {},
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: '',
            LoginDeviceId: 'f0eb9bbf4b5f1dd2c55b9b53d1fdc1ec'
          },
          baseURL: 'https://navigatehrdevapi-a4gecsfga6fnaxef.eastus-01.azurewebsites.net/api/',
          method: 'post',
          url: 'https://navigatehrdevapi-a4gecsfga6fnaxef.eastus-01.azurewebsites.net/api/Auth/Login',
          data: '{"email":"admin@saisystemshealth.com","password":"Admin@123"}',
          params: {}
        },
        request: {
          __zone_symbol__xhrSync: false,
          __zone_symbol__xhrURL: 'https://navigatehrdevapi-a4gecsfga6fnaxef.eastus-01.azurewebsites.net/api/Auth/Login',
          __zone_symbol__loadendfalse: [
            {
              type: 'eventTask',
              state: 'scheduled',
              source: 'XMLHttpRequest.addEventListener:loadend',
              zone: 'angular',
              runCount: 2
            }
          ],
          __zone_symbol__abortfalse: [
            {
              type: 'eventTask',
              state: 'scheduled',
              source: 'XMLHttpRequest.addEventListener:abort',
              zone: 'angular',
              runCount: 0
            }
          ],
          __zone_symbol__errorfalse: [
            {
              type: 'eventTask',
              state: 'scheduled',
              source: 'XMLHttpRequest.addEventListener:error',
              zone: 'angular',
              runCount: 0
            }
          ],
          __zone_symbol__timeoutfalse: [
            {
              type: 'eventTask',
              state: 'scheduled',
              source: 'XMLHttpRequest.addEventListener:timeout',
              zone: 'angular',
              runCount: 0
            }
          ],
          __zone_symbol__xhrScheduled: true,
          __zone_symbol__xhrErrorBeforeScheduled: false,
          __zone_symbol__xhrTask: {
            type: 'macroTask',
            state: 'notScheduled',
            source: 'XMLHttpRequest.send',
            zone: 'angular',
            runCount: 0
          }
        }
      };
      if (res?.status === 200 && res?.data?.isSuccess) {
        let today = new Date();
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let tomorrowTimestamp = tomorrow.getTime().toString();
        this.message.create('success', res.data.message);
        const tokenInfo = this.getDecodedAccessToken(res.data.data.token);
        tokenInfo.EmailId = this.validateForm.value.userName;
        tokenInfo.UserName = this.validateForm.value.userName;
        tokenInfo.FirstName = 'Guest';
        tokenInfo.LastName = 'User';
        localStorage.setItem('userInfo', JSON.stringify(tokenInfo));
        localStorage.setItem('isLoggedIn', 'yes');
        localStorage.setItem('exp', tomorrowTimestamp);
        localStorage.setItem('idle', '240');
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
        this.router.navigate(['/BotQueue/Index'], {
          queryParams: {
            receivedDateView: true,
            page: 'DocumentReceived',
            fstatus: -1,
            view: 1
          }
        });
        // } else if (res?.status === 200 && res?.data?.isTFAEnabled) {
        //   if (!res?.data?.isTFARegistered) {
        //     this.key = res?.data?.data?.manualEntryKey;
        //     this.QRImage = res?.data?.data?.qrCodeSetupImageUrl;
        //   } else if (res?.data?.isTFARegistered) {
        //     // localStorage.setItem('TFAReg', 'yes');

        //     this.dataSharingService.updateRegTFAD('yes');
        //     localStorage.setItem('regTFA', 'yes');
        //   }

        //   this.isTFA = true;
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
