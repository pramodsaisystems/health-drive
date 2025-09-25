// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

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

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ViewEditReportModalComponent } from './modal/view-edit-report.component';
import { SharedService } from 'src/app/activity.service';
interface Report {
  description: string;
  isactive: boolean;
  isclinical: boolean;
  isoperational: boolean;
  reportid: number;
  reportkey: string;
  reportname: string;
  reporttype: string;
}

@Component({
  selector: 'adm-report-list',
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
    NzCheckboxModule,
    ViewEditReportModalComponent
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export default class ReportListComponent {
  reportList: Report[] = [];
  reportTypeList: any[] = [];

  loading = false;
  isVisible = false;
  selectedRow = [];
  type = 'Add';

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private md: NzModalService,
    private sharedService: SharedService
  ) {
    this.validateForm = this.fb.group({
      search: [''],
      reportType: ['']
    });
  }

  validateForm: FormGroup<{
    search: FormControl<string>;
    reportType: FormControl<string>;
  }>;
  ngOnInit() {
    sessionStorage.setItem('dashboard', 'Report Configuration');
    this.getReportListData();
    this.getReportTypeList();
  }

  sortReportIdFn = (a: Report, b: Report): any => a.reportid - b.reportid;
  sortNameFn = (a: Report, b: Report): any => `${a.reportname}`.localeCompare(`${b.reportname}`);
  sortLongNameFn = (a: Report, b: Report): any => `${a.reportkey}`.localeCompare(`${b.reportkey}`);
  sortDescriptionFn = (a: Report, b: Report): any => a.description.localeCompare(b.description);
  sortTypeFn = (a: Report, b: Report): any => a.reporttype.localeCompare(b.reporttype);
  sortActiveFn = (a: Report, b: Report): any => !a.isactive && b.isactive;
  getReportListData = async () => {
    this.loading = true;
    let res: any = await get(
      APP_API_URL +
        'Report?pageSize=50000&pageNumber=0&searchText=' +
        this.validateForm.value.search +
        '&reportType=' +
        this.validateForm.value.reportType
    );

    this.loading = false;
    if (res?.status === 200) {
      this.reportList = res.data.reportList;
    }
  };

  getReportTypeList = async () => {
    let res: any = await get(APP_API_URL + 'Report/GetReportType');

    if (res?.status === 200) {
      this.reportTypeList = res.data;
    }
  };

  submitForm = async () => {
    if (this.validateForm.valid) {
      this.getReportListData();
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
      reportType: ''
    });
    this.getReportListData();
  };

  showModal = (data, type) => {
    this.sharedService.auditLog('Edit Report');
    this.isVisible = true;
    this.selectedRow = data;
    this.type = type;
  };

  onCloseModalEvent = (event) => {
    this.isVisible = false;
    if (event) {
      this.getReportListData();
    }
  };

  onToggleClick = async (data) => {
    // this.sharedService.auditLog('Edit Client');
    this.loading = true;
    let payload = {
      reportid: data.reportid,
      reportname: data.reportname,
      reporttype: data.reporttype,
      description: data.description,
      reportkey: data.reportkey,
      isclinical: data.isclinical,
      isoperational: data.isoperational,
      isactive: !data.isactive,
      currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
    };
    let res: any = await put(APP_API_URL + 'Report/' + data.reportid, payload);
    this.loading = false;
    if (res?.status === 204) {
      this.message.create('success', 'Report updated successfully!');
      this.getReportListData();
    } else {
      this.message.create('error', 'Error while updating report!');
    }
  };

  deleteReport = async (id) => {
    // this.sharedService.auditLog('Delete Client');
    // let res: any = await deleteAPI(APP_API_URL + 'Clients/' + id);
    // if (res?.status === 204) {
    //   this.message.create('success', 'Client deleted successfully!');
    //   this.getClientListData();
    //   this.dataSharingService.updateClientService(id);
    // } else if (res?.status === 409) {
    //   this.message.create('error', res?.response?.data);
    // } else {
    //   this.message.create('error', 'Unable to delete client!');
    // }
  };

  onDeleteReport = (userId) => {
    // this.md.confirm({
    //   nzTitle: 'Are you sure you want to delete this client?',
    //   nzOkText: 'Yes',
    //   nzOkType: 'primary',
    //   nzOkDanger: true,
    //   nzOnOk: () => this.deleteReport(userId),
    //   nzCancelText: 'No',
    //   nzOnCancel: () => console.log('Cancel')
    // });
  };

  onDeactivate = async (data) => {
    this.md.confirm({
      nzTitle: `Are you sure want to ${data.isactive ? 'deactivate' : 'activate'} this report?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onToggleClick(data),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  getDesc = (desc) => {
    if (desc?.length > 200) {
      return desc.substring(0, 200) + '...';
    } else {
      return desc;
    }
  };
}
