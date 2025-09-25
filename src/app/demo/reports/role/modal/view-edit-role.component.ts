import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { post, put } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
@Component({
  selector: 'view-edit-role-modal',
  standalone: true,
  imports: [
    NzModalModule,
    NzButtonComponent,
    NzInputDirective,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzCheckboxComponent
  ],
  templateUrl: './view-edit-role.component.html'
})
export class ViewEditRoleModalComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      userroleid: ['0'],
      rolename: ['', [Validators.required]],
      clientid: ['', [Validators.required]]
      // isshowntoddl: [true]
    });
  }
  @Input() isVisible = false;
  @Input() type = 'Add';
  @Input() selectedRow: any = [];
  @Input() clientsList: any = [];
  @Input() userRolesData: any = [];

  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() clientsListEvent = new EventEmitter<any>();

  validateForm: FormGroup<{
    userroleid: FormControl<any>;
    rolename: FormControl<any>;
    clientid: FormControl<any>;
    // isshowntoddl: FormControl<boolean>;
  }>;

  ngOnChanges() {
    if (this.selectedRow?.clientid) {
      this.validateForm.patchValue({
        userroleid: this?.selectedRow?.userroleid?.toString(),
        rolename: this?.selectedRow?.rolename,
        clientid: this?.selectedRow?.clientid?.toString()
        // isshowntoddl: this?.selectedRow?.isshowntoddl
      });
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
      let item1 = this.clientsList.find((i) => i.id == this.validateForm.value.clientid);
      // let item2 = this.userRolesData.find((i) => i.id == this.validateForm.value.userroleid);
      if (this.type === 'Add') {
        let payload = {
          userroleid: 0,
          rolename: this.validateForm.value.rolename ? this.validateForm.value.rolename.trim() : '',
          clientname: item1.name ? item1.name : '',
          clientid: parseInt(this.validateForm.value.clientid),
          // isshowntoddl: this.validateForm.value.isshowntoddl,
          isshowntoddl: true,
          isactive: true,
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await post(APP_API_URL + 'UserRoles', payload);
        if (res?.status === 201) {
          this.message.create('success', 'Role added successfully!');
          this.closeModalEvent.emit(true);
        } else if (res?.status === 409) {
          this.message.create('error', res?.response?.data);
        } else {
          this.message.create('error', 'Error while adding role!');
        }
      } else {
        let payload = {
          userroleid: parseInt(this.validateForm.value.userroleid),
          rolename: this.validateForm.value.rolename,
          clientname: item1.name ? item1.name : '',
          clientid: parseInt(this.validateForm.value.clientid),
          // isshowntoddl: this.validateForm.value.isshowntoddl,
          isshowntoddl: true,
          isactive: this.selectedRow.isactive,
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await put(APP_API_URL + 'UserRoles/' + this.selectedRow?.userroleid, payload);
        if (res?.status === 204) {
          this.message.create('success', 'Role updated successfully!');
          this.closeModalEvent.emit(true);
        } else {
          this.message.create('error', 'Error while updating role!');
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

  updateConfirmValidator = async (e) => {
    // this.clientsListEvent.emit(e);
  };
}
