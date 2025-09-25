import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { post, put } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DataSharingService } from 'src/utils/broadcast-service';
@Component({
  selector: 'view-edit-client-modal',
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
    NzSelectModule
  ],
  templateUrl: './view-edit-client.component.html'
})
export class ViewEditClientModalComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private dataSharingService: DataSharingService
  ) {
    this.validateForm = this.fb.group({
      clientshortname: ['', [Validators.required]],
      clientname: ['', [Validators.required]],
      sessionTime: ['20', [Validators.required]]
      // email: ['', [Validators.email, Validators.required]],
      // isshowinddl: [true]
    });
  }
  @Input() isVisible = false;
  @Input() type = 'Add';
  @Input() selectedRow: any = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();
  sessionList = [
    { id: '10 Mins', value: '10' },
    { id: '20 Mins', value: '20' },
    { id: '30 Mins', value: '30' },
    { id: '1 Hr', value: '60' },
    { id: '2 Hr', value: '120' },
    { id: '4 Hr', value: '240' },
    { id: '8 Hr', value: '480' }
  ];
  validateForm: FormGroup<{
    clientshortname: FormControl<string>;
    clientname: FormControl<string>;
    sessionTime: FormControl<string>;
    // email: FormControl<string>;
    // isshowinddl: FormControl<boolean>;
  }>;

  ngOnChanges() {
    if (this.selectedRow?.clientid) {
      this.validateForm.patchValue({
        clientshortname: this?.selectedRow?.clientshortname,
        clientname: this?.selectedRow?.clientname,
        sessionTime: this?.selectedRow?.sessionTimeout ? this?.selectedRow?.sessionTimeout?.toString() : '20'
        // isshowinddl: this.selectedRow.isshowinddl
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
      if (this.type === 'Add') {
        let payload = {
          clientid: 0,
          clientshortname: this.validateForm.value.clientshortname ? this.validateForm.value.clientshortname.trim() : '',
          clientname: this.validateForm.value.clientname,
          isactive: true,
          // isshowinddl: this.validateForm.value.isshowinddl,
          isshowinddl: true,
          sessionTimeout: this.validateForm.value.sessionTime ? this.validateForm.value.sessionTime : '0',
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await post(APP_API_URL + 'Clients', payload);
        if (res?.status === 201) {
          this.message.create('success', 'Client added successfully!');
          this.dataSharingService.updateClientService('0');
          this.closeModalEvent.emit(true);
        } else if (res?.status === 409) {
          this.message.create('error', res?.response?.data);
        } else {
          this.message.create('error', res?.response?.data ? res?.response?.data : 'Error while adding client!');
        }
      } else {
        let payload = {
          clientid: this.selectedRow?.clientid,
          clientshortname: this.validateForm.value.clientshortname,
          clientname: this.validateForm.value.clientname,
          isactive: this.selectedRow?.isactive,
          // isshowinddl: this.validateForm.value.isshowinddl,
          isshowinddl: true,
          sessionTimeout: this.validateForm.value.sessionTime ? this.validateForm.value.sessionTime : '0',
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await put(APP_API_URL + 'Clients/' + this.selectedRow?.clientid, payload);
        if (res?.status === 204) {
          this.message.create('success', 'Client updated successfully!');
          this.dataSharingService.updateClientService(this.selectedRow.clientid);
          this.closeModalEvent.emit(true);
        } else {
          this.message.create('error', res?.response?.data ? res?.response?.data : 'Error while updating client!');
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
}
