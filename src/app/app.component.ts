import { Component, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { post, get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { jwtDecode } from 'jwt-decode';
import { DataSharingService } from 'src/utils/broadcast-service';
import { Subscription, interval } from 'rxjs';
import { DeviceService } from 'src/utils/device.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'navigatEHR';
  timeout = 300;
  idleTimeout: any;
  idleState = 'Active';
  idleTimeStart: any = '';
  timeoutPeriod = this.timeout * 1000; // 5 minutes in milliseconds

  subscription: Subscription;
  private modalRef!: NzModalRef;
  private modalRef1!: NzModalRef;
  constructor(
    private router: Router,
    private i18n: NzI18nService,
    private modal: NzModalService,
    private message: NzMessageService,
    private dataSharingService: DataSharingService,
    private deviceService: DeviceService
  ) {}
  interval = null;
  interval1 = null;
  seconds = 30;
  timeoutId = null;
  ngOnInit() {
    document.addEventListener('visibilitychange', (e) => {
      if (document.visibilityState === 'visible') {
        if (window.location.href.indexOf('/login') == -1 && !localStorage.getItem('clientId') && !localStorage.getItem('token')) {
          this.router.navigate(['/guest/login']);
        }
        if (this.idleTimeStart) {
          let currTime: any = new Date();
          let diff = currTime - this.idleTimeStart;
          let time = diff / 60000;
          let idle = localStorage.getItem('idle') ? parseInt(localStorage.getItem('idle')) : 0;
          if (time > idle && idle !== 0) {
            clearInterval(this.interval1); // Clear the timer
            clearTimeout(this.timeoutId);
            this.seconds = 30; // Reset the timer
            this.modal.closeAll();
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/guest/login']);
          }
        }
        this.idleTimeStart = '';
      } else if (document.visibilityState === 'hidden') {
        this.idleTimeStart = new Date();
      }
    });

    // window.addEventListener('pagehide', () => {
    //   const userAgent = navigator.userAgent || navigator.vendor;
    //   if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
    //     this.idleTimeStart = new Date();
    //   }
    // });
    // window.addEventListener('focus', () => {
    //   const userAgent = navigator.userAgent || navigator.vendor;
    //   if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
    //     if (window.location.href.indexOf('/login') == -1 && !localStorage.getItem('clientId') && !localStorage.getItem('token')) {
    //       this.router.navigate(['/guest/login']);
    //     }
    //     if (this.idleTimeStart) {
    //       let currTime: any = new Date();
    //       let diff = currTime - this.idleTimeStart;
    //       let time = diff / 60000;
    //       let idle = localStorage.getItem('idle') ? parseInt(localStorage.getItem('idle')) : 0;
    //       if (time > idle && idle !== 0) {
    //         clearInterval(this.interval1); // Clear the timer
    //         clearTimeout(this.timeoutId);
    //         this.seconds = 30; // Reset the timer
    //         this.modal.closeAll();
    //         localStorage.clear();
    //         sessionStorage.clear();
    //         this.router.navigate(['/guest/login']);
    //       }
    //     }
    //     this.idleTimeStart = '';
    //   }
    // });
    // window.addEventListener('blur', () => {
    //   const userAgent = navigator.userAgent || navigator.vendor;
    //   if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
    //     if (window.location.href.indexOf('/login') == -1 && !localStorage.getItem('clientId') && !localStorage.getItem('token')) {
    //       this.router.navigate(['/guest/login']);
    //     }
    //     if (this.idleTimeStart) {
    //       let currTime: any = new Date();
    //       let diff = currTime - this.idleTimeStart;
    //       let time = diff / 60000;
    //       let idle = localStorage.getItem('idle') ? parseInt(localStorage.getItem('idle')) : 0;
    //       if (time > idle && idle !== 0) {
    //         clearInterval(this.interval1); // Clear the timer
    //         clearTimeout(this.timeoutId);
    //         this.seconds = 30; // Reset the timer
    //         this.modal.closeAll();
    //         localStorage.clear();
    //         sessionStorage.clear();
    //         this.router.navigate(['/guest/login']);
    //       }
    //     }
    //     this.idleTimeStart = '';
    //   }
    // });
    this.getDeviceId();
    if (window.location.href.indexOf('/login') == -1 && !localStorage.getItem('clientId') && !localStorage.getItem('token')) {
      this.router.navigate(['/guest/login']);
    }

    let expIn: any = localStorage.getItem('exp');
    if (expIn !== null) {
      const expTime = new Date(expIn * 1000);
      const currentTime = new Date();

      if (expTime < currentTime) {
        this.showSessExpModal();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/guest/login']);
      }
    }
    this.i18n.setLocale(en_US);
    this.checkSessionExp();
    this.interval = setInterval(() => {
      this.checkSessionExp();
    }, 10000);
    this.resetIdleTimer();
    this.subscription = this.dataSharingService.idleService$.subscribe((data) => {
      if (data) {
        this.resetIdleTimer();
      }
    });
  }
  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:mousedown')
  @HostListener('document:touchstart')
  resetIdleTimer() {
    clearTimeout(this.idleTimeout);
    this.idleState = 'Active';
    let expIn: any = localStorage.getItem('exp');
    if (expIn !== null) {
      const expTime: any = new Date(expIn * 1000);
      const currentTime: any = new Date();
      let diff = expTime - currentTime;
      let timer = diff / 60000;
      let idle: number = parseInt(localStorage.getItem('idle'));
      if (timer < idle) {
        if (timer < 2) {
          this.refreshToken(true);
        }
      } else {
        this.timeoutPeriod = idle * 60 * 1000;
      }
      if (
        currentTime - expTime >= 2 * 60 * 1000 &&
        document.getElementsByClassName('ant-modal-confirm').length === 0 &&
        window.location.href.indexOf('/login') == -1
      ) {
        clearInterval(this.interval1); // Clear the timer
        clearTimeout(this.timeoutId);
        this.seconds = 30; // Reset the timer
        this.modal.closeAll();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/guest/login']);
      } else {
        this.idleTimeout = setTimeout(() => {
          this.idleState = 'Idle';
          if (
            document.getElementsByClassName('ant-modal-confirm').length === 0 &&
            localStorage.getItem('token') &&
            window.location.href.indexOf('/login') == -1
          ) {
            this.setLogOffTimer();
            this.modalRef = this.modal.error({
              nzTitle: 'Session Timeout',
              nzContent: `You're being timed out due to inactivity. Please choose to stay signed in or to logoff.`,
              nzOkText: 'Stay Logged In',
              nzCancelText: `Log Off in ${this.seconds}`,
              nzData: { data: this.seconds },

              nzOnOk: () => {
                this.seconds = 30;
                if (this.interval1) {
                  clearInterval(this.interval1);
                }
                this.refreshToken(false);
                // localStorage.clear();
                // sessionStorage.clear();
                // window.location.href = '/guest/login';
              },
              nzOnCancel: () => {
                this.seconds = 30;
                if (this.interval1) {
                  clearInterval(this.interval1);
                }
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['/guest/login']);
              }
            });
          }
        }, this.timeoutPeriod);
      }
    }
  }

  getDeviceId = async () => {
    let res: any = await this.deviceService.getDeviceId();
    if (res) {
      localStorage.setItem('LoginDeviceId', res);
    }
  };
  setLogOffTimer = () => {
    this.interval1 = setInterval(() => {
      this.seconds--;
      this.modalRef?.updateConfig({
        nzCancelText: `Log Off in ${this.seconds}`
      });

      if (document.visibilityState === 'hidden') {
        this.timeoutId = setTimeout(() => {
          clearInterval(this.interval1); // Clear the timer
          clearTimeout(this.timeoutId);
          this.seconds = 30; // Reset the timer
          this.modal.closeAll();
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/guest/login']);
        }, 30000);
      } else {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
      }
      if (this.seconds === 0) {
        clearInterval(this.interval1); // Clear the timer
        this.seconds = 30; // Reset the timer
        this.modal.closeAll();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/guest/login']);
      }
    }, 1000);
  };

  checkSessionExp = () => {
    let expIn: any = localStorage.getItem('exp');
    // const expIn = null;
    if (expIn !== null) {
      const expTime: any = new Date(expIn * 1000);
      const currentTime: any = new Date();

      if (expTime < currentTime) {
        if (document.getElementsByClassName('ant-modal-confirm').length === 0) {
          if (this.idleState === 'Active') {
            this.refreshToken(true);
          } else {
            this.showSessExpModal();
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/guest/login']);
          }
        }
      }
    }
  };
  showSessExpModal() {
    this.modalRef1! = this.modal.error({
      nzTitle: 'Session Expired',
      nzContent: 'Your session timed out. To continue working, sign in again.',

      nzOnOk: () => {
        // localStorage.clear();
        // sessionStorage.clear();
        // window.location.href = '/guest/login';
      },
      nzOnCancel: () => {
        // localStorage.clear();
        // sessionStorage.clear();
        // window.location.href = '/guest/login';
      }
    });
  }
  ngDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.interval1) {
      clearInterval(this.interval1);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.dataSharingService.clearIdleService();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    document.removeEventListener('visibilitychange', () => {});
    // window.removeEventListener('pagehide', () => {});
    // window.removeEventListener('focus', () => {});
    // window.removeEventListener('blur', () => {});
    // localStorage.clear();
  }

  refreshToken = async (show) => {
    let res: any = await post(APP_API_URL + 'Auth/Refresh', {
      token: localStorage.getItem('token'),

      refreshToken: localStorage.getItem('refreshToken'),
      userLoginInfoId: localStorage.getItem('userLoginInfoId'),
      dayShiftStart: null,
      dayShiftEnd: null
    });

    if (res?.status === 200) {
      if (res?.data?.data?.token) {
        const tokenInfo = this.getDecodedAccessToken(res?.data?.data?.token);
        localStorage.setItem('exp', tokenInfo.exp);
        localStorage.setItem('token', res?.data?.data?.token);
        localStorage.setItem('refreshToken', res?.data?.data?.refreshToken);
        !show ? this.message.create('success', 'Session updated successfully!') : '';
      } else {
        !show ? this.message.create('success', 'Session updated successfully!') : '';
      }
    } else {
      this.message.create('error', 'Error while updating session!');
    }
    // this.closeModalEvent.emit(false);
  };

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}

//
