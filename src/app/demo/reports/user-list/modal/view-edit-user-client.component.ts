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
import { postFD, putFD, get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'view-edit-user-client-modal',
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
    CommonModule
  ],
  templateUrl: './view-edit-user-client.component.html'
})
export class ViewEditUserClientModalComponent {
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      userroleid: ['', [Validators.required]],
      clientid: ['', [Validators.required]],
      state: [[]],
      serviceloc: [[]],
      provider: [[]]
    });
  }

  selectedClientName?: string;
  @Input() isVisible = false;
  @Input() type = 'Add';
  @Input() selectedRow: any = [];
  @Input() clientsList: any = [];
  // clientsList: any = [];
  userRolesData: any = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() clientsListEvent = new EventEmitter<any>();
  @Output() updateClientEvent = new EventEmitter<any>();

  stateList: any = [];
  serviceLocList: any = [];
  providerList: any = [];
  disabledState: boolean = false;

  validateForm: FormGroup<{
    userroleid: FormControl<any>;
    clientid: FormControl<any>;

    state: FormControl<any>;
    serviceloc: FormControl<any>;
    provider: FormControl<any>;
  }>;

  ngOnInit() {
    console.log(this.type);

    if (this.type === 'Add' && localStorage.getItem('clientId')) {
      this.updateConfirmValidator(localStorage.getItem('clientId'), true);
      this.validateForm.patchValue({
        clientid: localStorage.getItem('clientId')
      });
      this.getStateList();
      // this.getProviderList();
      this.getServLocList('');
    }
  }

  ngOnChanges() {
    if (this.selectedRow?.clientId) {
      this.validateForm.patchValue({
        userroleid: this?.selectedRow?.roleId?.toString(),
        clientid: this?.selectedRow?.clientId?.toString(),
        state: this.selectedRow?.assignedStates?.length > 0 ? this.selectedRow.assignedStates.split(',') : [],
        serviceloc: this.selectedRow?.assignedServiceLocations?.length > 0 ? this.selectedRow.assignedServiceLocations.split(',') : [],
        provider: this.selectedRow?.assignedProviders?.length > 0 ? this.selectedRow.assignedProviders.split(',') : []
      });
      // this.validateForm.get('username')?.disable();

      if (this.selectedRow.clientId) {
        this.updateConfirmValidator(this.selectedRow.clientId, true);
      }

      // if (this.validateForm.value.provider.length > 0) {
      this.getStateList();
      // }
      // if (this.validateForm.value.state.length > 0) {
      this.getServLocList(this.validateForm.value.state);
      // }
      // if (this.validateForm.value.serviceloc.length > 0) {
      // this.getProviderList(this.validateForm.value.serviceloc);
      // }
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
      let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
      let item2 = this.userRolesData.find((i) => i.id == this.validateForm.value.userroleid);
      let data = {
        userClientId:
          this.type === 'Add' || (this.type === 'Edit' && (this.selectedRow.clientId !== item1.id || this.selectedRow.roleId !== item2.id))
            ? 0
            : this.selectedRow.userClientId,
        clientId: this.validateForm.value.clientid,
        roleId: this.validateForm.value.userroleid,
        assignedStates: this.validateForm.value.state.length > 0 ? this.validateForm.value.state.join(',') : '',
        assignedServiceLocations: this.validateForm.value.serviceloc.length > 0 ? this.validateForm.value.serviceloc.join(',') : '',
        assignedProviders: this.validateForm.value.provider.length > 0 ? this.validateForm.value.provider.join(',') : '',
        roleName: item2?.name ? item2.name : '',
        clientName: item1?.name ? item1.name : '',
        clientShortName: item1?.abbreviation ? item1.abbreviation : '',
        isUserAccess: this.selectedRow.isUserAccess ? this.selectedRow.isUserAccess : true,
        isDefault: this.selectedRow.isDefault ? this.selectedRow.isDefault : false,
        userId:
          this.type === 'Edit' && this.selectedRow.userClientId === 0
            ? localStorage.getItem('clientId')
            : this.selectedRow.userId
              ? this.selectedRow.userId
              : localStorage.getItem('clientId')
                ? localStorage.getItem('clientId')
                : 0
        // clientChanged: this.type === 'Edit' && (this.selectedRow.name !== item1.name || this.selectedRow.roleName !== item2.name)
      };

      this.updateClientEvent.emit(data);
      this.handleOk();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  };

  updateConfirmValidator = async (e, call?: boolean) => {
    if (!call) {
      this.validateForm.patchValue({
        userroleid: ''
      });
    }

    this.userRolesData = [];
    let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown?clientId=' + e);
    if (res?.status === 200) {
      this.userRolesData = res.data;
    }
    // this.getStateList(e, call);
    this.getProviderList(e, call);
    if (!call) {
      this.getServLocList('');
      this.getStateList();
    }
  };

  getStateList = async () => {
    this.stateList = [];
    let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
    this.selectedClientName = item1?.abbr ? item1.abbr : item1?.abbreviation ? item1?.abbreviation : '';
    let res: any = await get(
      APP_API_URL +
        'ECM/GetServiceStateDropdown?accountAbbreviation=' +
        (item1?.abbreviation ? item1?.abbreviation : localStorage.getItem('abbr'))
    );
    if (res?.status === 200) {
      this.stateList = res.data;
      let states = this.validateForm.value.state;
    }
  };

  getServLocList = async (e) => {
    this.serviceLocList = [];
    let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
    let states = e.length > 0 ? e.join(',') : '';
    let res: any = await get(
      APP_API_URL + 'ECM/GetServiceLocationDropdown?accountAbbreviation=' + item1?.abbreviation + '&states=' + encodeURIComponent(states)
    );
    if (res?.status === 200) {
      this.serviceLocList = res.data;
    }
  };

  getProviderList = async (e, call) => {
    if (!call) {
      this.validateForm.patchValue({
        state: [],
        serviceloc: [],
        provider: []
      });
    }
    this.providerList = [];
    let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);

    let res: any = await get(APP_API_URL + '/ECM/GetProviderDropdown?accountAbbreviation=' + item1?.abbreviation);
    if (res?.status === 200) {
      this.providerList = res.data;
    }
  };

  // onStateClick = (e) => {
  //   this.getServLocList(e);
  // };

  // onServeLocClick = async (e) => {
  //   this.getProviderList(e);
  // };

  // onProviderClick = (e) => {
  //   this.getStateList(e);
  //   if (this.validateForm.value.state.length === 0) {
  //     this.getServLocList([]);
  //   }
  // };
}
