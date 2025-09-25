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
import { CommonModule } from '@angular/common';
@Component({
  selector: 'view-edit-report-modal',
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
    CommonModule
  ],
  templateUrl: './view-edit-report.component.html'
})
export class ViewEditReportModalComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private dataSharingService: DataSharingService
  ) {
    this.validateForm = this.fb.group({
      reportname: ['', [Validators.required]],
      reportkey: ['', [Validators.required]],
      description: ['', [Validators.required]],

      isclinical: [false],
      isoperational: [false]
    });
  }
  @Input() isVisible = false;
  @Input() type = 'Add';
  @Input() selectedRow: any = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();

  validateForm: FormGroup<{
    reportname: FormControl<string>;
    reportkey: FormControl<string>;
    description: FormControl<string>;
    // email: FormControl<string>;
    isoperational: FormControl<boolean>;
    isclinical: FormControl<boolean>;
  }>;

  ngOnChanges() {
    if (this.selectedRow?.reportid) {
      this.validateForm.patchValue({
        reportname: this?.selectedRow?.reportname,
        reportkey: this?.selectedRow?.reportkey,
        description: this?.selectedRow?.description,
        isoperational: this.selectedRow.isoperational,
        isclinical: this.selectedRow.isclinical
      });
      this.validateForm.get('reportkey')?.disable(); // Disable
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
          reportid: 0,
          reportkey: this.validateForm.value.reportkey ? this.validateForm.value.reportkey : '',
          reportname: this.validateForm.value.reportname ? this.validateForm.value.reportname : '',
          description: this.validateForm.value.description ? this.validateForm.value.description : '',
          isactive: true,
          isclinical: this.validateForm.value.isclinical,
          isoperational: this.validateForm.value.isoperational,
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await post(APP_API_URL + 'Report', payload);
        if (res?.status === 201) {
          this.message.create('success', 'Report added successfully!');

          this.closeModalEvent.emit(true);
        } else if (res?.status === 409) {
          this.message.create('error', res?.response?.data);
        } else {
          this.message.create('error', res?.response?.data ? res?.response?.data : 'Error while adding report!');
        }
      } else {
        let payload = {
          reportid: this.selectedRow.reportid,
          reportkey: this.validateForm.value.reportkey ? this.validateForm.value.reportkey : '',
          reportname: this.validateForm.value.reportname ? this.validateForm.value.reportname : '',
          description: this.validateForm.value.description ? this.validateForm.value.description : '',
          isactive: this.selectedRow.isactive,
          isclinical: this.validateForm.value.isclinical,
          isoperational: this.validateForm.value.isoperational,
          currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
        };
        let res: any = await put(APP_API_URL + 'Report/' + this.selectedRow?.reportid, payload);
        if (res?.status === 204) {
          this.message.create('success', 'Report updated successfully!');

          this.closeModalEvent.emit(true);
        } else {
          this.message.create('error', res?.response?.data ? res?.response?.data : 'Error while updating report!');
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
