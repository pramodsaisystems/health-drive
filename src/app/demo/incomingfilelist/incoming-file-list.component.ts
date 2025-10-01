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
  selector: 'incoming-file-list',
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
  templateUrl: './incoming-file-list.component.html',
  styleUrls: ['./incoming-file-list.component.scss']
})
export default class IncomingFileListComponent {
  selectedRow = [];
  fileListData: any[] = [];
  rolesList: Role[] = [];
  siteList: any[] = [];
  faxStatusList: any[] = [];
  viewFilterList: any[] = [];
  docTypeList: any[] = [];
  exceptStatList: any[] = [];

  loading = false;

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder
  ) {
    this.validateForm = this.fb.group({
      daterange: [''],
      faxStatus: [''],
      patientName: [''],
      viewFiltList: [''],
      siteName: [''],
      docType: [''],
      fileName: [''],
      exceptStatus: [''],
      newPatient: ['0']
    });
  }

  validateForm: FormGroup<{
    daterange: FormControl<string>;
    faxStatus: FormControl<string>;
    patientName: FormControl<string>;
    viewFiltList: FormControl<string>;
    siteName: FormControl<string>;
    docType: FormControl<string>;
    fileName: FormControl<string>;
    exceptStatus: FormControl<string>;
    newPatient: FormControl<string>;
  }>;
  ngOnInit() {
    // this.getListData();
    this.getSiteList();
    this.getFaxStatusList();
    this.getViewFilterList();
    this.getDocTypeList();
    this.getExceptStatList();
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  getSiteList = async () => {
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetSites');
    if (res?.status === 200) {
      this.siteList = res?.data?.Result?.data;
    }
  };

  getFaxStatusList = async () => {
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetStatus');
    if (res?.status === 200) {
      let sitedata = res?.data?.Result?.data;
      let list = sitedata.filter((x) => x.processid <= 4).map((x) => ({ id: String(x.processid), text: x.processname }));
      this.faxStatusList = list;
    }
  };
  getViewFilterList = async () => {
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetPortalViewList');

    if (res?.status === 200) {
      let data = res?.data?.Result?.data;
      let list = data.filter((x) => x.id !== '').map((x) => ({ id: x.id, text: x.text }));
      this.viewFilterList = list;
    }
  };

  getDocTypeList = async () => {
    let keywordData = await this.getKeyWords();
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetPortalDocumentTypes');

    if (res?.status === 200) {
      debugger;
      let data = ['CPR'];
      let templst = keywordData
        .filter((x) => x.document_name !== '' && (data.length === 0 || data.some((y) => y?.toLowerCase() === x?.lob?.toLowerCase())))
        .reduce((acc, curr) => {
          // Check if group with same document_name and display_name exists
          if (!acc.some((item) => item.document_name === curr.document_name && item.display_name === curr.display_name)) {
            acc.push(curr);
          }
          return acc;
        }, []);

      this.docTypeList = templst;
    }
  };

  getExceptStatList = async () => {
    let res: any = await get1(APP_HD_URL + 'BotQueue/GetStatus');
    const status = [74, 75, 76, 79, 82, 84, 85, 86, 87, 88, 89, 94, 95, 96];
    if (res?.status === 200) {
      let sitedata = res?.data?.Result?.data;
      let namelst = [];
      sitedata.forEach((x) => {
        if (status.includes(x.processid)) {
          let nameLower = x.processname.toLowerCase();
          if (!namelst.some((e) => e.toLowerCase() === nameLower)) {
            namelst.push(x.processname);
          }
        }
      });

      // Map to dropdown options
      let lst = namelst.map((x, ind) => ({ id: ind, text: x }));

      this.exceptStatList = lst;
    }
  };

  getKeyWords = async () => {
    let res: any = await get1(APP_HD_URL + 'keywords/GetListOfKeywords');
    if (res?.status === 200) {
      return res?.data?.Result?.data;
    } else {
      return [];
    }
  };

  getListData = async () => {
    this.loading = true;
    let d1 =
      this.validateForm.value.daterange === null || this.validateForm.value.daterange === ''
        ? ' '
        : new Date(this.validateForm?.value?.daterange[0]).toLocaleDateString();
    let d2 =
      this.validateForm.value.daterange === null || this.validateForm.value.daterange === ''
        ? ''
        : new Date(this.validateForm?.value?.daterange[1]).toLocaleDateString();
    let res: any = await get1(
      APP_HD_URL +
        `BotQueue/GetBotQueueDashBoardHome?view_type=${this.validateForm.value.viewFiltList === null || this.validateForm.value.viewFiltList === '' ? '1' : this.validateForm.value.viewFiltList}` +
        `&date_range=${this.validateForm.value.daterange === null || this.validateForm.value.daterange === '' ? '' : encodeURIComponent(`${d1} - ${d2}`)}` +
        `&fax_status=${this.validateForm.value.faxStatus === null || this.validateForm.value.faxStatus === '' ? '-1' : this.validateForm.value.faxStatus}` +
        `&patient_name=${this.validateForm.value.patientName === null ? '' : encodeURIComponent(this.validateForm.value.patientName.trim())}` +
        `&site_name=${this.validateForm.value.siteName === null || this.validateForm.value.siteName === '' ? '-1' : this.validateForm.value.siteName}` +
        `&document_name=${this.validateForm.value.docType === null || this.validateForm.value.docType === '' ? '-1' : encodeURIComponent(this.validateForm.value.docType)}` +
        `&exception_status=${this.validateForm.value.exceptStatus === null || this.validateForm.value.exceptStatus === '' ? '-1' : this.validateForm.value.exceptStatus}` +
        `&file_name=${this.validateForm.value.fileName === null ? '' : this.validateForm.value.fileName}` +
        `&patient_type=${this.validateForm.value.newPatient}`
    );
    this.loading = false;
    if (res?.status === 200) {
      this.fileListData = res?.data?.Result?.data;
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
      daterange: '',
      faxStatus: '',
      patientName: '',
      viewFiltList: '',
      siteName: '',
      docType: '',
      fileName: '',
      exceptStatus: '',
      newPatient: '0'
    });

    // this.getListData();
  };
}
