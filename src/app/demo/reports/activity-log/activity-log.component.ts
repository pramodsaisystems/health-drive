// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { get, deleteAPI, putFD } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';
import { NzModalService } from 'ng-zorro-antd/modal';
interface AuditLog {
  auditLogId: number;
  email: string;
  ipaddress: string;
  loginDevice: string;
  loginSource: string;
  osversion: string;
  pageName: string;
  userId: number;
  userLoginInfoId: string;
  firstName: string;
  lastName: string;
  createdDate: string;
}

@Component({
  selector: 'adm-user-list',
  standalone: true,
  imports: [
    SharedModule,
    NzTableModule,
    NzIconModule,

    NzSwitchModule,
    NzPopconfirmModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzSelectModule,
    NzButtonModule,

    NzToolTipModule,
    InformationModalComponent
  ],
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export default class ActivityLogComponent {
  auditLogs: AuditLog[] = [];

  loading = false;

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private md: NzModalService
  ) {
    this.validateForm = this.fb.group({
      search: ['']
    });
  }

  validateForm: FormGroup<{
    search: FormControl<string>;
  }>;
  ngOnInit() {
    sessionStorage.setItem('dashboard', 'Activity Log');
    this.getAuditLogData();
  }

  sortNameFn = (a: AuditLog, b: AuditLog): any => `${a.firstName}`.localeCompare(`${b.firstName}`);
  sortUserIdFn = (a: AuditLog, b: AuditLog): any => a.userId - b.userId;
  sortAuditLogIdFn = (a: AuditLog, b: AuditLog): any => a.auditLogId - b.auditLogId;
  sortIpAddressFn = (a: AuditLog, b: AuditLog): any => a.ipaddress.localeCompare(b.ipaddress);
  sortLoginDeviceFn = (a: AuditLog, b: AuditLog): any => a.loginDevice.localeCompare(b.loginDevice);
  sortEmailFn = (a: AuditLog, b: AuditLog): any => a.email.localeCompare(b.email);
  sortLoginSourceFn = (a: AuditLog, b: AuditLog): any => a.loginSource.localeCompare(b.loginSource);

  sortOsVersionFn = (a: AuditLog, b: AuditLog): any => a.osversion.localeCompare(b.osversion);
  sortPageNameFn = (a: AuditLog, b: AuditLog): any => a.pageName.localeCompare(b.pageName);
  sortUserLoginInfoIdFn = (a: AuditLog, b: AuditLog): any => a.userLoginInfoId.localeCompare(b.userLoginInfoId);
  sortLastLogInFn = (a: AuditLog, b: AuditLog): any => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
  getAuditLogData = async () => {
    this.loading = true;
    let res: any = await get(APP_API_URL + 'AuditLogs?pageSize=500&pageNumber=0&searchText=' + this.validateForm.value.search);

    this.loading = false;
    if (res?.status === 200) {
      this.auditLogs = res.data.auditLogList;
    }
  };

  submitForm = async () => {
    if (this.validateForm.valid) {
      this.getAuditLogData();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  };

  handleReset = () => {
    this.validateForm.patchValue({
      search: ''
    });
    this.getAuditLogData();
  };
}
