import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  selector: 'ref-files-view1',
  standalone: true,
  imports: [NzTableModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './ref-files-view1.component.html'
})
export class RefFilesView1Component {
  @Input() fileListData = [];
  @Input() validateForm!: FormGroup;
  @Input() formDataCopy: any = {};

  loading: boolean = false;
  constructor() {}

  ngOnChanges() {
    console.log(this.formDataCopy);
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  queryParams(data, faxStatus) {
    const docType = this.formDataCopy?.docType;
    const exceptStatus = this.formDataCopy?.exceptStatus;
    const siteName = this.formDataCopy?.siteName;
    return {
      dateRange: data.date,
      documentType: Array.isArray(docType) && docType.length > 0 ? docType.join(',') : '',
      faxStatus: faxStatus,
      site_name: Array.isArray(siteName) && siteName.length > 0 ? siteName.join(',') : '',
      file_name: this.formDataCopy?.fileName,
      exception_status: Array.isArray(exceptStatus) && exceptStatus.length > 0 ? exceptStatus.join(',') : '',
      patient_name: this.formDataCopy?.patientName,
      patient_type: this.formDataCopy?.newPatient
    };
  }
}
