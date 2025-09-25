// shared.service.ts
import { Injectable } from '@angular/core';
import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  deviceInfo: any;
  ipInfo: any;

  constructor(
    private deviceService: DeviceDetectorService,
    private http: HttpClient
  ) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.getIPInfo();
  }

  getIPInfo() {
    this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe(
      (data) => {
        this.ipInfo = data.ip;
        console.log('IP Information:', this.ipInfo);
      },
      (error) => {
        console.error('Error fetching IP information:', error);
      }
    );
  }
  auditLog(data) {
    let userData = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    let payload = {
      auditLogId: 0,
      userId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0,
      userLoginInfoId: localStorage.getItem('userLoginInfoId') ? localStorage.getItem('userLoginInfoId') : '',
      ipaddress: this.ipInfo ? this.ipInfo : '',
      osversion: this?.deviceInfo?.os_version ? this?.deviceInfo?.os_version : '',
      loginSource:
        this.deviceInfo.browser && this.deviceInfo.browser_version
          ? `${this.deviceInfo.browser} ${this.deviceInfo.browser_version}`
          : this.deviceInfo.browser
            ? this.deviceInfo.browser
            : '',
      loginDevice: this.deviceInfo.deviceType ? this.deviceInfo.deviceType : '',
      pageName: data ? (localStorage.getItem('abbr') ? localStorage.getItem('abbr') + ' - ' + data : data) : '',
      email: userData?.email ? userData?.email : ''
    };
    post(APP_API_URL + 'AuditLogs/AddLog', payload);
  }
}
