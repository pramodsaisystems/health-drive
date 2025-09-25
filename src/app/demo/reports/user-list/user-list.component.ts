// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ViewEditUserModalComponent } from './modal/view-edit-user.component';
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
// import { EditReportMenuModalComponent } from './modal/edit-report-menu.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SharedService } from 'src/app/activity.service';
interface User {
  userId: number;
  firstname: string;
  middlename: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  userroleid: number;
  rolename: string;
  clientid: number;
  isactive: boolean;
  currentUserId: string;
  profilephotopath: string;
  profileFile: string;
  agreementaccepted: boolean;
  clientname: string;
  assignedstates: string;
  assignedservicelocations: string;
  assignedproviders: string;
  lastloggedindatetime: string;
  isTFAEnabled: boolean;
  isTFARegistered: boolean;
  isTFAReset: boolean;
  isUserAccess: boolean;
  isLocked: boolean;
  userClientList: any;
}

@Component({
  selector: 'adm-user-list',
  standalone: true,
  imports: [
    SharedModule,
    NzTableModule,
    NzIconModule,
    ViewEditUserModalComponent,
    NzSwitchModule,
    NzPopconfirmModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzSelectModule,
    NzButtonModule,
    // EditReportMenuModalComponent,
    NzToolTipModule,
    InformationModalComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export default class UserListComponent {
  isVisible = false;
  selectedRow = [];
  type = 'Add';
  userList: User[] = [];
  userRolesData: any =
    localStorage.getItem('role')?.toLowerCase() === 'super admin' ? [{ abbreviation: null, id: 1, name: 'Super Admin' }] : [];
  allUserRolesData: any = [];
  clientsList: any = [];
  loading = false;
  // reportMenuMapList: any = [];
  // isERMVisible = false;
  isIMVisible = false;
  currUserId = localStorage.getItem('currentUserId') ? parseInt(localStorage.getItem('currentUserId')) : 0;

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private md: NzModalService,
    private sharedService: SharedService
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
    sessionStorage.setItem('dashboard', 'Users');
    this.getUserListData();
    // this.getAllUserRolesDrpDwnData();
    this.getClientsDrpDwnData();
  }

  sortNameFn = (a: User, b: User): any => `${a.firstname}`.localeCompare(`${b.firstname}`);
  sortUserNameFn = (a: User, b: User): any => a.username.localeCompare(b.username);
  sortFirstNameFn = (a: User, b: User): any => a.firstname.localeCompare(b.firstname);
  sortLastNameFn = (a: User, b: User): any => a.lastname.localeCompare(b.lastname);
  sortClientNameFn = (a: User, b: User): any => a.clientname.localeCompare(b.clientname);
  sortEmailFn = (a: User, b: User): any => a.email.localeCompare(b.email);
  sortRoleFn = (a: User, b: User): any => a.rolename.localeCompare(b.rolename);
  sortLastLogInFn = (a: User, b: User): any => new Date(a.lastloggedindatetime).getTime() - new Date(b.lastloggedindatetime).getTime();
  sortActiveFn = (a: User, b: User): any => !a.isactive && b.isactive;
  getUserListData = async () => {
    this.loading = true;
    let res: any = await get(
      APP_API_URL +
        'Users?pageSize=500&pageNumber=0&searchText=' +
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
      this.userList = res.data.userList;
    }
  };

  getUserRolesDrpDwnData = async (e) => {
    if (e) {
      this.userRolesData = [];
      let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
      if (res?.status === 200) {
        this.userRolesData = res.data;
      }
    }
  };

  getAllUserRolesDrpDwnData = async () => {
    this.allUserRolesData = [];
    let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown');
    if (res?.status === 200) {
      this.allUserRolesData = res.data;
    }
  };

  getClientsDrpDwnData = async () => {
    let res: any = await get(APP_API_URL + 'Clients/GetClientsDropdown');
    if (res?.status === 200) {
      this.clientsList = res.data;
    }
  };

  showModal = (data, type) => {
    this.sharedService.auditLog('Edit User');
    this.isVisible = true;
    this.selectedRow = JSON.parse(JSON.stringify(data));
    this.type = type;
  };

  onCloseModalEvent = (event) => {
    this.isVisible = false;
    this.selectedRow = [];
    if (event) {
      this.getUserListData();
    }
  };

  deleteUser = async (id) => {
    this.sharedService.auditLog('Delete User');
    let res: any = await deleteAPI(APP_API_URL + 'Users/' + id);
    if (res?.status === 204) {
      this.message.create('success', 'User deleted successfully!');
      this.getUserListData();
    } else if (res?.status === 409) {
      this.message.create('error', res?.response?.data);
    } else {
      this.message.create('error', 'Unable to delete user!');
    }
  };

  onAddNewUser = () => {
    this.sharedService.auditLog('Add User');
    this.isVisible = true;
    this.selectedRow = [];
    this.type = 'Add';
  };

  onToggleClick = async (data) => {
    this.sharedService.auditLog('Edit User');
    this.loading = true;
    let fd: any = new FormData();

    fd.append('userId', data.userId);
    fd.append('firstname', data.firstname);
    fd.append('middlename', data.middlename);
    fd.append('lastname', data.lastname);
    fd.append('username', data.username);
    fd.append('password', data.password);
    fd.append('email', data.email);

    fd.append('userroleid', data.userroleid);
    fd.append('rolename', data.rolename);
    fd.append('clientid', data.clientid);
    fd.append('clientname', data.clientname);
    fd.append('isactive', !data.isactive);
    fd.append('currentUserId', localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : '0');
    // fd.append('profilephotopath', this?.selectedRow?.profilephotopath ? this.selectedRow.profilephotopath : null);
    // fd.append('profileFile', this?.selectedRow?.profileFile ? this.selectedRow.profileFile : null);
    fd.append('agreementaccepted', data.agreementaccepted);
    fd.append('Assignedstates', data.assignedstates);
    fd.append('Assignedservicelocations', data.assignedservicelocations);
    fd.append('Assignedproviders', data.assignedproviders);

    let res: any = await putFD(APP_API_URL + 'Users/UpdateUserStatus/' + data.userId, fd);
    this.loading = false;
    if (res?.status === 204) {
      this.message.create('success', 'User updated successfully!');
      this.getUserListData();
    } else {
      this.message.create('error', 'Error while updating user!');
    }
  };

  cancel() {}

  onClientsListEvent = (e) => {
    this.getUserRolesDrpDwnData(e);
  };

  submitForm = async () => {
    if (this.validateForm.valid) {
      this.getUserListData();
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
    this.userRolesData =
      localStorage.getItem('role')?.toLowerCase() === 'super admin' ? [{ abbreviation: null, id: 1, name: 'Super Admin' }] : [];
    this.getUserListData();
  };

  // onERMCloseModalEvent = (event) => {
  //   this.isERMVisible = false;
  // };

  // editReportMapping = async (data) => {
  //   this.sharedService.auditLog('Edit User Menu Mapping');
  //   this.reportMenuMapList = [];
  //   let res: any = await get(APP_API_URL + 'UserMenuMapping?userId=' + data?.userId + '&pageSize=1000&pageNumber=0&isActive=true');
  //   if (res?.status === 200) {
  //     this.reportMenuMapList = res?.data?.userMenuMapingList;
  //     this.isERMVisible = true;
  //     this.selectedRow = data;
  //   }
  // };

  onClientChange = async (e) => {
    if (this.validateForm.value.userroleid) {
      this.validateForm.patchValue({ userroleid: '' });
    }
    this.getUserRolesDrpDwnData(e);
  };

  onInfoClick() {
    this.isIMVisible = true;
  }

  onIMCloseModalEvent(e) {
    this.isIMVisible = false;
  }

  onDeleteUser = (userId) => {
    this.md.confirm({
      nzTitle: 'Are you sure delete this user?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(userId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  onDeactivate = async (data) => {
    this.md.confirm({
      nzTitle: `Are you sure want to ${data.isactive ? 'deactivate' : 'activate'} this user?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onToggleClick(data),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  getTitleForClient = (list) => {
    let keyString = list.map((item) => item.clientName).join(' | ');
    return keyString;
  };
}
