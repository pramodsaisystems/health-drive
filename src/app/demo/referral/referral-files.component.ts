// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { get, deleteAPI, put, get1 } from 'src/utils/api';
import { APP_API_URL, APP_HD_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';

interface Role {
  clientid: number;
  clientname: string;
  currentUserId: number;
  isactive: boolean;
  isshowntoddl: boolean;
  rolename: string;
  userroleid: number;
}

@Component({
  selector: 'referral-file-list',
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
    InformationModalComponent,
    NzDatePickerModule
  ],
  templateUrl: './referral-files.component.html',
  styleUrls: ['./referral-files.component.scss']
})
export default class ReferralFileListComponent {
  selectedRow = [];

  rolesList: Role[] = [];

  loading = false;

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {
    this.validateForm = this.fb.group({
      search: [''],
      clientid: [''],
      userroleid: [''],
      status: ['']
    });
  }

  validateForm: FormGroup<{
    search: FormControl<string>;
    clientid: FormControl<string>;
    userroleid: FormControl<string>;
    status: FormControl<string>;
  }>;
  ngOnInit() {
    this.getSampleList();
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  getSampleList = async () => {
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetPortalViewList');
    console.log(res);
  };

  getRoleListData = async () => {
    this.loading = true;
    let res: any = await get(
      APP_API_URL +
        'UserRoles?pageSize=500&pageNumber=0&searchText=' +
        this.validateForm.value.search +
        '&userRoleId=' +
        this.validateForm.value.userroleid +
        '&clientId=' +
        this.validateForm.value.clientid +
        '&isActive=' +
        (this.validateForm.value.status === '' ? '' : this.validateForm.value.status === '1' ? true : false)
    );

    this.loading = false;
    if (res?.status === 200) {
      this.rolesList = res.data.userRoleList;
    }
  };

  getUserRolesDrpDwnData = async (e) => {
    // this.userRolesData = [];
    // let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
    // if (res?.status === 200) {
    //   this.userRolesData = res.data;
    // }
  };

  cancel() {}

  submitForm = async () => {
    if (this.validateForm.valid) {
      // this.getRoleListData();
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
      search: '',
      userroleid: '',
      clientid: '',
      status: ''
    });
  };
}
