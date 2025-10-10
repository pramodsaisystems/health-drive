// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { get, deleteAPI, put, get1, get2 } from 'src/utils/api';
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
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HistoryModalComponent } from 'src/app/component/modal/history-modal.component';
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
  selector: 'exce-page-details',
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
    HistoryModalComponent,
    RouterModule
  ],
  templateUrl: './exce-page-details.component.html'
  // styleUrls: ['./exce-details-file.component.scss']
})
export default class ExecDetailsFileComponent {
  exceDetailsFileData: any[] = [];
  faxid: string = '';
  faxStatus: string = '';
  exception: string = '';
  patient_group_id: string = '';
  document_group_id: string = '';
  loading = false;
  isHMVisible: boolean = false;
  historyData: any[] = [];

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getExcePageDetailsList();
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  getExcePageDetailsList = async () => {
    this.faxid = this.route.snapshot.queryParamMap.get('faxid');
    this.faxStatus = this.route.snapshot.queryParamMap.get('faxStatus');
    this.exception = this.route.snapshot.queryParamMap.get('status');
    this.patient_group_id = this.route.snapshot.queryParamMap.get('patient_group_id');
    this.document_group_id = this.route.snapshot.queryParamMap.get('document_group_id');
    this.loading = true;

    let res: any = await get1(
      APP_HD_URL +
        `BotQueue/GetBotQueueException?` +
        `faxid=${this.faxid === null || this.faxid === '' ? '' : this.faxid}` +
        `&site_name=${this.faxStatus === null || this.faxStatus === '' ? '-1' : this.faxStatus}`
    );

    if (res?.status === 200) {
      this.exceDetailsFileData = res?.data?.Result?.data;
      this.exceDetailsFileData = this.exceDetailsFileData
        .filter(
          (x) =>
            x.faxid.toLowerCase() === this.faxid.toLowerCase() &&
            x.patient_group_id == this.patient_group_id &&
            x.document_group_id == this.document_group_id
        )
        .sort((a, b) => a.sequence - b.sequence);
      this.loading = false;
    }
  };
  cancel() {}

  openHistory = async (faxid) => {
    this.onInfoClick();
    let res: any = await get2(APP_HD_URL + `BotQueue/GetAuditFaxData?` + `faxid=${faxid === null || faxid === '' ? '-1' : faxid}`);

    if (res?.status === 200) {
      this.historyData = res?.data?.Result?.data;
      this.onInfoClick();
    }
  };

  onInfoClick() {
    this.isHMVisible = true;
  }

  onHMCloseModalEvent(e) {
    this.isHMVisible = false;
  }
}
