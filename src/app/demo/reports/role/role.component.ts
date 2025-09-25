// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ViewEditRoleModalComponent } from './modal/view-edit-role.component';
import { get, deleteAPI, put } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EditRoleMenuModalComponent } from './modal/edit-role-menu.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SharedService } from 'src/app/activity.service';
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
  selector: 'adm-role-list',
  standalone: true,
  imports: [
    SharedModule,
    NzTableModule,
    NzIconModule,
    ViewEditRoleModalComponent,
    NzSwitchModule,
    NzPopconfirmModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzSelectModule,
    NzButtonModule,
    EditRoleMenuModalComponent,
    NzToolTipModule,
    InformationModalComponent
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export default class RoleListComponent {
  isVisible = false;
  selectedRow = [];
  type = 'Add';
  rolesList: Role[] = [];
  userRolesData: any = [];
  allUserRolesData: any = [];
  clientsList: any = [];
  isERMVisible = false;
  loading = false;
  roleMenuMapList = [];
  isIMVisible = false;

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
    sessionStorage.setItem('dashboard', 'Roles');
    this.getRoleListData();
    // this.getAllUserRolesDrpDwnData();
    this.getClientsDrpDwnData();
  }
  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

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
    this.userRolesData = [];
    let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
    if (res?.status === 200) {
      this.userRolesData = res.data;
    }
  };

  getAllUserRolesDrpDwnData = async (e) => {
    if (e) {
      this.allUserRolesData = [];
      let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
      if (res?.status === 200) {
        this.allUserRolesData = res.data;
      }
    }
  };

  getClientsDrpDwnData = async () => {
    let res: any = await get(APP_API_URL + 'Clients/GetClientsDropdown');
    if (res?.status === 200) {
      this.clientsList = res.data;
    }
  };
  showModal = (data, type) => {
    this.sharedService.auditLog('Edit Role');
    this.isVisible = true;
    this.selectedRow = data;
    this.type = type;
  };

  onCloseModalEvent = (event) => {
    this.isVisible = false;
    if (event) {
      this.getRoleListData();
    }
  };

  onERMCloseModalEvent = (event) => {
    this.isERMVisible = false;
  };

  deleteRole = async (id) => {
    this.sharedService.auditLog('Delete Role');
    let res: any = await deleteAPI(APP_API_URL + 'UserRoles/' + id);
    if (res?.status === 204) {
      this.message.create('success', 'Role deleted successfully!');
      this.getRoleListData();
    } else if (res?.status === 409) {
      this.message.create('error', res?.response?.data);
    } else {
      this.message.create('error', 'Unable to delete role!');
    }
  };

  onAddNewRole = () => {
    this.sharedService.auditLog('Add Role');
    this.isVisible = true;
    this.selectedRow = [];
    this.type = 'Add';
  };

  onToggleClick = async (data) => {
    this.sharedService.auditLog('Edit Role');
    this.loading = true;
    let payload = {
      userroleid: parseInt(data.userroleid),
      rolename: data.rolename,
      clientname: data.clientname,
      clientid: data.clientid,
      isshowntoddl: data.isshowntoddl,
      isactive: !data.isactive,
      currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
    };
    let res: any = await put(APP_API_URL + 'UserRoles/' + data.userroleid, payload);
    this.loading = false;
    if (res?.status === 204) {
      this.message.create('success', 'Role updated successfully!');
      this.getRoleListData();
    } else if (res?.status === 409) {
      this.message.create('error', res?.response?.data);
    } else {
      this.message.create('error', 'Error while updating role!');
    }
  };

  cancel() {}

  onClientsListEvent = (e) => {
    this.getUserRolesDrpDwnData(e);
  };

  submitForm = async () => {
    if (this.validateForm.valid) {
      this.getRoleListData();
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
    this.allUserRolesData = [];
    this.getRoleListData();
  };

  editReportMapping = async (data) => {
    this.sharedService.auditLog('Edit Role Menu Mapping');
    this.roleMenuMapList = [];
    let res: any = await get(
      APP_API_URL + 'RoleMenuMapping?userRoleId=' + data?.userroleid + '&clientId=' + data?.clientid + '&pageSize=0&pageNumber=1000'
    );
    if (res?.status === 200) {
      this.roleMenuMapList = res?.data?.roleMenuMapList;
      this.isERMVisible = true;
      this.selectedRow = data;
    }
  };

  onClientChange = async (e) => {
    if (this.validateForm.value.userroleid) {
      this.validateForm.patchValue({ userroleid: '' });
    }
    this.getAllUserRolesDrpDwnData(e);
  };

  onInfoClick() {
    this.isIMVisible = true;
  }

  onIMCloseModalEvent(e) {
    this.isIMVisible = false;
  }

  onDeleteRole = (userId) => {
    this.md.confirm({
      nzTitle: 'Are you sure you want to delete this role?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteRole(userId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  onDeactivate = async (data) => {
    this.md.confirm({
      nzTitle: `Are you sure want to ${data.isactive ? 'deactivate' : 'activate'} this role?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onToggleClick(data),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };
}
