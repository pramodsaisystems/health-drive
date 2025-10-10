// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { get, deleteAPI, put, get1 } from 'src/utils/api';
import { APP_API_URL, APP_HD_URL, APP_HD_URL1 } from 'src/utils/urls';
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
import { OpenseadragonViewerComponent } from 'src/app/openseadragon-viewer/openseadragon-viewer.component';

import { Location } from '@angular/common';

import AccountInfoComponent from '../accountinfo/acc-info.component';

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
  selector: 'page-exception',
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
    RouterModule,
    OpenseadragonViewerComponent,
    AccountInfoComponent
  ],
  templateUrl: './page-exception.component.html',
  styleUrls: ['./page-exception.component.scss']
})
export default class PageExceptionComponent {
  loading = false;
  faxdata: any = {};
  patientGroupData: any = {};
  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.getFaxDetails();
    this.getPatientGroupingInfo();
  }

  goBack = () => {
    this.location.back();
  };

  getFaxDetails = async () => {
    debugger;
    let faxid = this.route.snapshot.queryParamMap.get('faxid');
    if (faxid) {
      let res: any = await get1(APP_HD_URL + `Fax?FaxId=` + faxid);
      if (res?.status === 200) {
        this.faxdata = res?.data?.Result?.data;
      }
    }
  };

  getPatientGroupingInfo = async () => {
    debugger;
    let faxid = this.route.snapshot.queryParamMap.get('faxid');
    let actionstatus = this.route.snapshot.queryParamMap.get('actionstatus')
      ? this.route.snapshot.queryParamMap.get('actionstatus')
      : 'view';
    let faxdoctagid = this.route.snapshot.queryParamMap.get('faxdoctagid') ? this.route.snapshot.queryParamMap.get('faxdoctagid') : '';
    let patient_group_id = this.route.snapshot.queryParamMap.get('patient_group_id')
      ? this.route.snapshot.queryParamMap.get('patient_group_id')
      : '0';
    if (faxid) {
      let res: any = await get1(APP_HD_URL + `portal/GetPatientGroupingInfo?fax=` + faxid);
      if (res?.status === 200) {
        this.patientGroupData = res?.data?.Result?.data;
      }
    }
  };
}
