import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  ValidatorFn,
  AbstractControl,
  FormArray,
  FormBuilder
} from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { post, put, get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { ViewEditUserClientModalComponent } from './view-edit-user-client.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { EditReportMenuModalComponent } from './edit-report-menu.component';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'view-edit-user-modal',
  standalone: true,
  imports: [
    NzModalModule,
    NzButtonComponent,
    NzInputDirective,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzCheckboxModule,
    NzSelectModule,
    NzIconModule,
    NzCheckboxComponent,
    CommonModule,
    ViewEditUserClientModalComponent,
    NzTableModule,
    NzToolTipModule,
    NzSwitchModule,
    NzRadioModule,
    EditReportMenuModalComponent
  ],
  templateUrl: './view-edit-user.component.html'
})
export class ViewEditUserModalComponent {
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private md: NzModalService
  ) {
    this.validateForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      agreementaccepted: [false],
      middlename: [''],
      // username: ['', [Validators.required]],
      password: ['', [Validators.required, this.passwordValidator]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      // userroleid: ['', [Validators.required]],
      // clientid: ['', [Validators.required]],
      // state: [[]],
      // serviceloc: [[]],
      // provider: [[]],
      isTFAEnabled: [false],
      isTFAReset: [false],
      isLocked: [false]
    });
  }

  passwordVisible = false;
  showPwd = false;
  showConfPwd = false;
  password1?: string;
  selectedClientName?: string;
  showClientModal = false;
  currIndex = 0;
  clientModalType = 'add';
  selectedClientRow = [];
  reportMenuMapList: any = [];
  isERMVisible = false;
  currentPage = 1;
  currRole = localStorage.getItem('role') ? localStorage.getItem('role').toLowerCase() : '';
  @Input() isVisible = false;
  @Input() type = 'Add';
  @Input() selectedRow: any = [];
  @Input() clientsList: any = [];
  aeUserClientList: any = [];
  // @Input() userRolesData: any = [];
  userRolesData: any = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() clientsListEvent = new EventEmitter<any>();

  stateList: any = [];
  serviceLocList: any = [];
  providerList: any = [];
  disabledState: boolean = false;
  userClientList: any = [];
  loading: boolean = false;
  validateForm: FormGroup<{
    firstname: FormControl<string>;
    middlename: FormControl<string>;
    lastname: FormControl<string>;
    // username: FormControl<string>;
    password: FormControl<string>;
    // userroleid: FormControl<any>;
    // clientid: FormControl<any>;
    email: FormControl<string>;
    agreementaccepted: FormControl<boolean>;
    checkPassword: FormControl<string>;
    // state: FormControl<any>;
    // serviceloc: FormControl<any>;
    // provider: FormControl<any>;
    isTFAEnabled: FormControl<boolean>;
    isTFAReset: FormControl<boolean>;
    isLocked: FormControl<boolean>;
  }>;

  ngOnInit() {
    console.log(this.type);
    // if (this.type === 'Add' && localStorage.getItem('clientId')) {
    //   this.updateConfirmValidator(localStorage.getItem('clientId'), true);
    //   // this.validateForm.patchValue({
    //   //   clientid: localStorage.getItem('clientId')
    //   // });
    // }
    // this.getStateList();
    // this.getProviderList();
    // this.getServLocList();
  }

  ngOnChanges() {
    if (this.selectedRow?.userId) {
      this.loading = true;
      this.validateForm.patchValue({
        firstname: this?.selectedRow?.firstname,
        lastname: this?.selectedRow?.lastname,
        middlename: this?.selectedRow?.middlename,
        password: 'Test@123', //tweak for edit user not passing while updating
        // username: this?.selectedRow?.username,
        // userroleid: this?.selectedRow?.userroleid?.toString(),
        // clientid: this?.selectedRow?.clientid?.toString(),
        email: this?.selectedRow?.email,
        agreementaccepted: this?.selectedRow?.agreementaccepted,
        checkPassword: 'Test@123', //tweak for edit user not passing while updating
        // state: this.selectedRow?.assignedstates?.length > 0 ? this.selectedRow.assignedstates.split(',') : [],
        // serviceloc: this.selectedRow?.assignedservicelocations?.length > 0 ? this.selectedRow.assignedservicelocations.split(',') : [],
        // provider: this.selectedRow?.assignedproviders?.length > 0 ? this.selectedRow.assignedproviders.split(',') : [],
        isTFAEnabled: this.selectedRow?.isTFAEnabled ? this.selectedRow.isTFAEnabled : false,
        isTFAReset: this.selectedRow?.isTFAReset ? this.selectedRow.isTFAReset : false,
        isLocked: this.selectedRow?.isLocked ? this.selectedRow.isLocked : false
      });
      // this.validateForm.get('username')?.disable();
      this.validateForm.get('email')?.disable();
      // if (this.selectedRow.clientid) {
      //   this.updateConfirmValidator(this.selectedRow.clientid, true);
      // }

      // if (this.validateForm.value.state.length > 0) {
      //   this.getServLocList(this.validateForm.value.state);
      // }
      // if (this.validateForm.value.serviceloc.length > 0) {
      //   this.getProviderList(this.validateForm.value.serviceloc);
      // }

      this.userClientList = this?.selectedRow?.userClientList ? this?.selectedRow?.userClientList : [];
      this.loading = false;
    }
  }

  handleOk(): void {
    this.closeModalEvent.emit(false);
  }

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  submitForm = async () => {
    if (this.validateForm.valid) {
      // console.log('submit', this.validateForm.value);
      // let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
      // let item2 = this.userRolesData.find((i) => i.id == this.validateForm.value.userroleid);
      if (this.type === 'Add') {
        if (this.userClientList.length === 0 && this.selectedRow.userroleid !== 1) {
          this.message.create('error', 'Minimum one client is required. Please add client and then save the details.');
          return;
        }
        let data = {
          userId: 0,
          firstname: this.validateForm.value.firstname,
          middlename: this.validateForm.value.middlename,
          lastname: this.validateForm.value.lastname,
          username: this.validateForm.value.email,
          password: this.validateForm.value.password,
          email: this.validateForm.value.email,

          userroleid: 0,
          // fd.append('rolename', item2?.name ? item2.name : '');
          // fd.append('clientid', parseInt(this.validateForm.value.clientid));
          // fd.append('clientname', item1?.name ? item1.name : '');

          isactive: true,
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : '0',
          // fd.append('profilephotopath', this?.selectedRow?.profilephotopath ? this.selectedRow.profilephotopath : null);
          // fd.append('profileFile', this?.selectedRow?.profileFile ? this.selectedRow.profileFile : null);
          agreementaccepted: this.validateForm.value.agreementaccepted,
          // fd.append('Assignedstates', this?.validateForm?.value?.state?.length > 0 ? this.validateForm.value.state.join(',') : '');
          // fd.append(
          //   'Assignedservicelocations',
          //   this?.validateForm?.value?.serviceloc?.length > 0 ? this.validateForm.value.serviceloc.join(',') : ''
          // );
          // fd.append('Assignedproviders', this?.validateForm?.value?.provider?.length > 0 ? this.validateForm.value.provider.join(',') : '');
          IsTFAEnabled: this?.validateForm?.value?.isTFAEnabled ? this?.validateForm?.value?.isTFAEnabled : false,
          IsTFARegistered: this?.selectedRow.isTFARegistered ? this?.selectedRow.isTFARegistered : false,
          IsTFAReset: this?.selectedRow.isTFAReset ? this?.selectedRow.isTFAReset : false,
          userClientList: this.userClientList,
          isLocked: this?.validateForm?.value?.isLocked ? this?.validateForm?.value?.isLocked : false
        };
        let res: any = await post(APP_API_URL + 'Users/AddUser', data);
        if (res?.status === 201) {
          this.message.create('success', 'User added successfully!');
          this.closeModalEvent.emit(true);
        } else if (res?.status === 409) {
          this.message.create('error', res?.response?.data);
        } else {
          this.message.create('error', 'Error while adding user!');
        }
      } else {
        if (this.userClientList.length === 0 && this.selectedRow.userroleid !== 1) {
          this.message.create('error', 'Minimum one client is required. Please add client and then save the details.');
          return;
        }
        let data = {
          userId: this.selectedRow.userId,
          firstname: this.validateForm.value.firstname,
          middlename: this.validateForm.value.middlename,
          lastname: this.validateForm.value.lastname,
          username: this.selectedRow.email,
          // fd.append('password', this.validateForm.value.password);
          email: this.selectedRow.email,

          // fd.append('userroleid', parseInt(this.validateForm.value.userroleid));
          // fd.append('rolename', item2?.name ? item2.name : '');
          // fd.append('clientid', parseInt(this.validateForm.value.clientid));
          // fd.append('clientname', item1?.name ? item1.name : '');
          isactive: this.selectedRow.isactive,
          // fd.append('currentUserId', localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : '0');
          // fd.append('profilephotopath', this?.selectedRow?.profilephotopath ? this.selectedRow.profilephotopath : null);
          // fd.append('profileFile', this?.selectedRow?.profileFile ? this.selectedRow.profileFile : null);
          agreementaccepted: this.validateForm.value.agreementaccepted,
          // fd.append('Assignedstates', this?.validateForm?.value?.state?.length > 0 ? this.validateForm.value.state.join(',') : '');
          // fd.append(
          //   'Assignedservicelocations',
          //   this?.validateForm?.value?.serviceloc?.length > 0 ? this.validateForm.value.serviceloc.join(',') : ''
          // );
          // fd.append('Assignedproviders', this?.validateForm?.value?.provider?.length > 0 ? this.validateForm.value.provider.join(',') : '');
          IsTFAEnabled: this?.validateForm?.value?.isTFAEnabled ? this?.validateForm?.value?.isTFAEnabled : false,
          IsTFARegistered: this?.selectedRow.isTFARegistered ? this?.selectedRow.isTFARegistered : false,
          IsTFAReset: this?.validateForm?.value?.isTFAReset ? this?.validateForm?.value?.isTFAReset : false,
          userClientList: this.userClientList,
          isLocked: this?.validateForm?.value?.isLocked ? this?.validateForm?.value?.isLocked : false
        };
        let res: any = await put(APP_API_URL + 'Users/' + this.selectedRow?.userId, data);
        if (res?.status === 204) {
          this.message.create('success', 'User updated successfully!');
          this.closeModalEvent.emit(true);
        } else {
          this.message.create('error', 'Error while updating user!');
        }
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

  // updateConfirmValidator = async (e, call?: boolean) => {
  //   if (!call) {
  //     this.validateForm.patchValue({
  //       userroleid: ''
  //     });
  //   }

  //   this.userRolesData = [];
  //   let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
  //   if (res?.status === 200) {
  //     this.userRolesData = res.data;
  //   }
  //   this.getStateList(e, call);
  // };

  updateConfirmValidator1 = async () => {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  };

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  onShowPwd = (e) => {
    this.showPwd = !e;
  };

  onShowConfPwd = (e) => {
    this.showConfPwd = !e;
  };

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Regex for strong password
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isValidLength) {
      return { passwordStrength: true }; // Return error if password does not meet criteria
    }

    return null;
  }

  // getStateList = async (e, call?: boolean) => {
  //   if (!call) {
  //     this.validateForm.patchValue({
  //       state: [],
  //       serviceloc: [],
  //       provider: []
  //     });
  //   }

  //   this.stateList = [];
  //   let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
  //   this.selectedClientName = item1.abbr;
  //   let res: any = await get(APP_API_URL + 'ECM/GetServiceStateDropdown?accountAbbreviation=' + item1?.abbreviation);
  //   if (res?.status === 200) {
  //     this.stateList = res.data;
  //   }
  // };

  // getServLocList = async (e) => {
  //   this.serviceLocList = [];
  //   let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
  //   let states = e.length > 0 ? e.join(',') : '';
  //   let res: any = await get(
  //     APP_API_URL + 'ECM/GetServiceLocationDropdown?accountAbbreviation=' + item1?.abbreviation + '&states=' + encodeURIComponent(states)
  //   );
  //   if (res?.status === 200) {
  //     this.serviceLocList = res.data;
  //     let locs = this.validateForm.value.serviceloc;
  //     if (locs.length > 0) {
  //       let updatedlocs = this.serviceLocList.filter((element) => locs.includes(element.name));
  //       if (updatedlocs.length > 0 && updatedlocs.length != locs.length) {
  //         this.validateForm.patchValue({
  //           serviceloc: updatedlocs.map((d) => d.name)
  //         });
  //         this.getProviderList(updatedlocs);
  //       }
  //     }

  //     if (states.length === 0 && locs.length !== 0) {
  //       this.validateForm.patchValue({
  //         serviceloc: []
  //       });
  //       this.getProviderList([]);
  //     }
  //   }
  // };

  // getProviderList = async (e) => {
  //   this.providerList = [];
  //   let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
  //   let servLocs = e.length > 0 ? e.join(',') : '';
  //   let res: any = await get(
  //     APP_API_URL +
  //       '/ECM/GetProviderDropdown?accountAbbreviation=' +
  //       item1?.abbreviation +
  //       '&serviceLocations=' +
  //       encodeURIComponent(servLocs)
  //   );
  //   if (res?.status === 200) {
  //     this.providerList = res.data;
  //     let providers = this.validateForm.value.provider;
  //     if (providers.length > 0) {
  //       let updatedprovs = this.providerList.filter((element) => providers.includes(element.name));
  //       if (updatedprovs.length > 0) {
  //         this.validateForm.patchValue({
  //           provider: updatedprovs.map((d) => d.name)
  //         });
  //       }
  //     }

  //     if (servLocs.length === 0) {
  //       this.validateForm.patchValue({
  //         provider: []
  //       });
  //     }
  //   }
  // };

  // onStateClick = (e) => {
  //   this.getServLocList(e);
  // };

  // onServeLocClick = async (e) => {
  //   this.getProviderList(e);
  // };

  onAddClient = async () => {
    let res: any = await get(APP_API_URL + 'Clients/GetClientsDropdown');
    if (res?.status === 200) {
      this.aeUserClientList = res.data;
      this.currIndex = 0;
      this.clientModalType = 'Add';
      this.selectedClientRow = [];
      this.showClientModal = true;
    }
  };
  // handleOk(): void {
  //   this.closeModalEvent.emit(false);
  // }

  onHandleCancel(e): void {
    this.showClientModal = false;
  }

  onUpdateClient = (e) => {
    this.loading = true;
    if (this.clientModalType === 'Add') {
      if (this.userClientList.length > 0) {
        let samelient = this.userClientList.findIndex((d) => d.clientId == e.clientId);
        if (samelient !== -1) {
          this.message.create('error', 'The same client cannot be added multiple times.');
          this.loading = false;
          return;
        }
      }
      this.userClientList.push({
        userClientId: e.userClientId,
        userId: localStorage.getItem('clientId') ? localStorage.getItem('clientId') : 0,
        clientId: e.clientId,
        clientName: e.clientName,
        clientShortName: e.clientShortName,
        roleId: e.roleId,
        roleName: e.roleName,
        assignedStates: e.assignedStates,
        assignedServiceLocations: e.assignedServiceLocations,
        assignedProviders: e.assignedProviders,
        isDefault: this.userClientList.length === 0 ? true : false,
        isActive: true,
        isUserAccess: e.isUserAccess
        // clientChanged: false
      });
      if (this.userClientList.length > 1) {
        let ind = this.userClientList.findIndex((d) => d.isDefault);
        if (ind === -1 && this.userClientList.length > 0) {
          this.userClientList[0].isDefault = true;
        }
      }
      this.userClientList = [...this.userClientList];
    } else {
      if (this.userClientList.length > 0) {
        let samelient = this.userClientList.findIndex((d, i) => d.clientId == e.clientId && i != this.currIndex);
        if (samelient !== -1) {
          this.message.create('error', 'The same client cannot be added multiple times.');
          this.loading = false;
          return;
        }
      }
      this.userClientList[this.currIndex] = {
        userClientId: e.userClientId,
        clientId: e.clientId,
        clientName: e.clientName,
        clientShortName: e.clientShortName,
        roleId: e.roleId,
        roleName: e.roleName,
        assignedStates: e.assignedStates,
        assignedServiceLocations: e.assignedServiceLocations,
        assignedProviders: e.assignedProviders,
        isDefault: e.isDefault ? e.isDefault : false,
        isActive: true,
        isUserAccess: e.isUserAccess,
        userId: this.selectedRow.userId ? this.selectedRow.userId : 0
        // clientChanged: e.clientChanged ? e.clientChanged : false
      };
      if (this.userClientList.length > 0) {
        let ind = this.userClientList.findIndex((d) => d.isDefault);
        if (ind === -1 && this.userClientList.length > 0) {
          this.userClientList[0].isDefault = true;
        }
      }
      this.userClientList = [...this.userClientList];
    }
    this.loading = false;
  };

  onDefaultClient = (e, ind) => {
    this.userClientList.map((d, i) => {
      d.isDefault = (this.currentPage - 1) * 5 + ind === i;
    });
  };

  onEditClient = async (e, ind) => {
    let res: any = await get(APP_API_URL + 'Clients/GetClientsDropdown');
    if (res?.status === 200) {
      this.aeUserClientList = res.data;
      this.currIndex = ind;
      this.clientModalType = 'Edit';
      this.selectedClientRow = e;
      this.showClientModal = true;
    }
  };

  onDeleteClient = (e, ind) => {
    this.md.confirm({
      nzTitle: 'Are you sure delete this client?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteClient(e, ind),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  deleteClient = (e, ind) => {
    if (this.userClientList.length === 1) {
      this.userClientList.pop();
      this.userClientList = [...this.userClientList];
    } else {
      let data = this.userClientList.filter((d, i) => i != (this.currentPage - 1) * 5 + ind);
      if (data.length > 1) {
        let ind = data.findIndex((d) => d.isDefault);
        if (ind === -1 && data.length > 0) {
          data[0].isDefault = true;
        }
      } else if (data.length === 1) {
        data[0].isDefault = true;
      }
      this.userClientList = [...data];
    }
  };

  onERMCloseModalEvent = (event) => {
    this.isERMVisible = false;
    this.selectedClientRow = [];
  };

  editReportMapping = async (data) => {
    // this.sharedService.auditLog('Edit User Menu Mapping');
    this.reportMenuMapList = [];
    let res: any = await get(
      APP_API_URL + 'UserMenuMapping?userId=' + data?.userId + '&clientId=' + data?.clientId + '&pageSize=1000&pageNumber=0&isActive=true'
    );
    if (res?.status === 200) {
      this.reportMenuMapList = res?.data?.userMenuMapingList;
      this.isERMVisible = true;
      this.selectedClientRow = data;
    }
  };
}
