// angular import
import { Component, Input } from '@angular/core';

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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
import { AccInfoInsuTableComponent } from 'src/app/component/tables/acc-info-insu-table.component';
import { AccInfoAuthServableComponent } from 'src/app/component/tables/acc-info-auth-serv.component';
import { AccInfoCommTableComponent } from 'src/app/component/tables/acc-info-comm.component';
import { AccInfoRPSTableComponent } from 'src/app/component/tables/acc-info-rps.component';
import { AccInfoDocsTableComponent } from 'src/app/component/tables/acc-info-docs.component';

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
  selector: 'acc-info',
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
    NzDatePickerModule,
    RouterModule,
    NzCheckboxModule,
    NzTabsModule,
    CommonModule,
    AccInfoInsuTableComponent,
    AccInfoAuthServableComponent,
    AccInfoCommTableComponent,
    AccInfoRPSTableComponent,
    AccInfoDocsTableComponent
  ],
  templateUrl: './acc-info.component.html',
  styleUrls: ['./acc-info.component.scss']
})

//Consider this as Index file which loaded after login as per old app
export default class AccountInfoComponent {
  accInfoInsuranceList = [];

  loading = false;
  @Input() faxdata = [];
  @Input() patientGroupData = [];

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute
  ) {
    this.validateForm = this.fb.group({
      lname: [''],
      fname: [''],
      mname: [''],
      sex: [''],
      mrn: [''],
      ssn: [''],
      dob: [''],
      race: [''],
      accno: [''],
      insurance: [''],
      unit: [''],
      reccreated: [''],
      enrolldate: [''],
      compl: [''],
      decon: [''],
      deconch: [''],
      va: [''],
      dischon: [''],
      dischonch: [''],
      contractfor: [''],
      pccname: [''],
      phone: [''],
      admin: [''],
      fax: [''],
      contact: ['']
      // daterange: [''],
      // faxStatus: ['-1'],
      // patientName: [''],
      // viewFiltList: ['1'],
      // siteName: [''],
      // docType: [''],
      // fileName: [''],
      // exceptStatus: [''],
      // newPatient: ['0']
    });
  }

  validateForm: FormGroup<{
    lname: FormControl<string>;
    fname: FormControl<string>;
    mname: FormControl<string>;
    sex: FormControl<string>;
    mrn: FormControl<string>;
    ssn: FormControl<string>;
    dob: FormControl<string>;
    race: FormControl<string>;
    accno: FormControl<string>;
    insurance: FormControl<string>;
    unit: FormControl<string>;
    reccreated: FormControl<string>;
    enrolldate: FormControl<string>;
    compl: FormControl<string>;
    decon: FormControl<string>;
    deconch: FormControl<string>;
    va: FormControl<string>;
    dischon: FormControl<string>;
    dischonch: FormControl<string>;
    contractfor: FormControl<string>;
    pccname: FormControl<string>;
    phone: FormControl<string>;
    admin: FormControl<string>;
    fax: FormControl<string>;
    contact: FormControl<string>;
  }>;
  ngOnInit() {
    debugger;
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  cancel() {}

  submitForm = async () => {
    if (this.validateForm.valid) {
      // this.getListData();
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
      lname: '',
      fname: '',
      mname: '',
      sex: '',
      mrn: '',
      ssn: '',
      dob: '',
      race: '',
      accno: '',
      insurance: '',
      unit: '',
      reccreated: '',
      enrolldate: '',
      compl: '',
      decon: '',
      deconch: '',
      va: '',
      dischon: '',
      dischonch: '',
      contractfor: '',
      pccname: '',
      phone: '',
      admin: '',
      fax: '',
      contact: ''
    });

    // this.getListData();
  };
}
