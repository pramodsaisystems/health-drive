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
  selector: 'exce-details-file',
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
    HistoryModalComponent
  ],
  templateUrl: './exce-details-file.component.html'
  // styleUrls: ['./exce-details-file.component.scss']
})
export default class ExecDetailsFileComponent {
  exceDetailsFileData: any[] = [];

  exceptionDetailsFileListData: any[] = [];

  loading = false;
  expandSet = new Set<number>();
  isHMVisible: boolean = false;
  historyData: any[] = [];
  faxStatus: string = '-1';
  exception: string = '';

  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getExceptDetailsFileList();
  }

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  getExceptDetailsFileList = async () => {
    let faxid = this.route.snapshot.queryParamMap.get('faxid');
    this.faxStatus = this.route.snapshot.queryParamMap.get('faxStatus');
    this.exception = this.route.snapshot.queryParamMap.get('status');
    this.loading = true;

    let res: any = await get1(
      APP_HD_URL +
        `BotQueue/GetBotQueueException?` +
        `faxid=${faxid === null || faxid === '' ? '' : faxid}` +
        `&site_name=${this.faxStatus === null || this.faxStatus === '' ? '-1' : this.faxStatus}`
    );
    this.loading = false;
    if (res?.status === 200) {
      this.exceptionDetailsFileListData = res?.data?.Result?.data;
      if (this.exceptionDetailsFileListData.length > 0) {
        this.exceptionDetailsFileListData = this.exceptionDetailsFileListData.sort((a, b) => a.sequence - b.sequence);
      }
      const lstgrpitems = Object.values(
        this.exceptionDetailsFileListData.reduce((acc, item) => {
          // create composite key by concatenating all relevant properties
          const key = [
            item.faxid,
            item.patient_name,
            item.document_type,
            item.MRN,
            item.exception_details,
            item.patient_group_id,
            item.document_group_id,
            item.faxdoctagid,
            item.ActionTaken,
            item.CurrentUser,
            item.current_fax_status,
            item.ResolvedBy,
            item.lob,
            item.lob_source,
            item.file_source,
            item.sender_faxnumber,
            item.receiving_faxnumber,
            item.original_faxfile_datetime,
            item.sourceid,
            item.referral_source,
            item.service_location,
            item.department,
            item.sender_faxname,
            item.receiving_faxname,
            item.derived_servicelocation
          ]
            .map((x) => x ?? '')
            .join('|');

          if (!acc[key]) {
            acc[key] = {
              faxid: item.faxid,
              patient_name: item.patient_name,
              document_type: item.document_type,
              MRN: item.MRN,
              exception_details: item.exception_details,
              patient_group_id: item.patient_group_id,
              document_group_id: item.document_group_id,
              faxdoctagid: item.faxdoctagid,
              ActionTaken: item.ActionTaken,
              CurrentUser: item.CurrentUser,
              current_fax_status: item.current_fax_status,
              ResolvedBy: item.ResolvedBy,
              lob: item.lob,
              lob_source: item.lob_source,
              file_source: item.file_source,
              sender_faxnumber: item.sender_faxnumber,
              receiving_faxnumber: item.receiving_faxnumber,
              original_faxfile_datetime: item.original_faxfile_datetime,
              sourceid: item.sourceid,
              referral_source: item.referral_source,
              service_location: item.service_location,
              department: item.department,
              sender_faxname: item.sender_faxname,
              receiving_faxname: item.receiving_faxname,
              derived_servicelocation: item.derived_servicelocation,
              PageCount: 1,
              sequence: item.sequence
            };
          } else {
            acc[key].PageCount += 1;
            acc[key].sequence = Math.min(acc[key].sequence, item.sequence);
          }
          return acc;
        }, {})
      );

      if (lstgrpitems && lstgrpitems.length > 0) {
        const sortedItemd = lstgrpitems
          .map((item: any) => ({
            faxid: item.faxid,
            patient_name: item.patient_name,
            document_type: item.document_type,
            MRN: item.MRN,
            exception_details: item.exception_details,
            patient_group_id: item.patient_group_id,
            document_group_id: item.document_group_id,
            faxdoctagid: item.faxdoctagid,
            PageCount: item.PageCount,
            ActionTaken: item.ActionTaken,
            CurrentUser: item.CurrentUser,
            current_fax_status: item.current_fax_status,
            ResolvedBy: item.ResolvedBy,
            fax_file_path: this.exceptionDetailsFileListData[0].fax_file_path,
            lob: item.lob,
            lob_source: item.lob_source,
            sequence: item.sequence,
            file_source: item.file_source,
            sender_faxnumber: item.sender_faxnumber,
            receiving_faxnumber: item.receiving_faxnumber,
            original_faxfile_datetime: item.original_faxfile_datetime,
            sourceid: item.sourceid,
            referral_source: item.referral_source,
            service_location: item.service_location,
            department: item.department,
            sender_faxname: item.sender_faxname,
            receiving_faxname: item.receiving_faxname,
            derived_servicelocation: item.derived_servicelocation
          }))
          .sort((a, b) => a.sequence - b.sequence); // JavaScript .sort()

        this.exceDetailsFileData = sortedItemd;
      }
    }
  };

  cancel() {}

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openPageimg = async (thisobj) => {
    const filename = thisobj?.image_file_path ? thisobj?.image_file_path.trim() : thisobj;
    const apiUrl = APP_HD_URL + 'BotQueue/GetPageImg'; // Replace with actual endpoint
    try {
      // Get page image file path
      const response = await get1(`${apiUrl}?url=${encodeURIComponent(filename)}`);
      const filePath = await response.text(); // If API returns plain text file path

      if (filePath.includes('.')) {
        const imgPath = '../' + filePath;
        const exists = await this.imageExists(imgPath);

        if (exists) {
          window.open(imgPath);
        } else {
          alert('Error unable to retrieve the file');
        }
      } else {
        alert('Error unable to retrieve the file');
      }
    } catch (error) {
      alert('Error unable to retrieve the file');
    }
  };

  // async version, returns true if file exists
  imageExists = async (image_url) => {
    if (image_url !== '../') {
      try {
        const res = await fetch(image_url, { method: 'HEAD' });
        return res.status !== 404;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  };

  openHistory = async (faxid) => {
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
