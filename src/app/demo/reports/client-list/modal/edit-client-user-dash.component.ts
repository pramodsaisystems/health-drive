import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { put, get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { DataSharingService } from 'src/utils/broadcast-service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'edit-client-user-dash-modal',
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
    NzCheckboxComponent,
    NzTableModule,
    CommonModule
  ],
  templateUrl: './edit-client-user-dash.component.html'
})
export class EditClientUserDashModalComponent {
  constructor(
    private message: NzMessageService,
    private dataSharingService: DataSharingService
  ) {}
  @Input() isCUDVisible = false;
  @Input() selectedRow: any = [];
  @Input() selectedReportId = 0;
  @Input() selectedReportName = '';
  @Output() closeModalEvent = new EventEmitter<boolean>();
  ngOnInit() {
    if (this.selectedReportId !== 0 && this.selectedRow.clientid) {
      this.getClientUsersList(this.selectedReportId, this.selectedRow.clientid);
    }
  }

  clientUserMapList: any[] = [];

  ngOnChanges() {}

  getClientUsersList = async (reportId, clientId) => {
    let res: any = await get(APP_API_URL + `UserMenuMapping/GetUsersListForReport?clientId=${clientId}&reportId=${reportId}`);
    if (res?.status === 200) {
      this.clientUserMapList = res.data.reportUserList;
    } else {
      this.message.create('error', 'Error while getting user mapping list!');
    }
  };

  handleOk = async () => {
    let res: any = await put(
      APP_API_URL + 'UserMenuMapping/UpdateUsersForReport/' + this.selectedRow.clientid + '/' + this.selectedReportId,
      this.clientUserMapList
    );
    if (res?.status === 204) {
      this.message.create('success', 'User mapping updated successfully!');
      this.closeModalEvent.emit(true);
    } else {
      this.message.create('error', 'Error while updating user mapping!');
    }
    // this.closeModalEvent.emit(false);
  };

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  onClickMenu = (e) => {
    let ind = this.clientUserMapList.findIndex((d) => {
      return d.userid === e.userid;
    });

    if (ind !== -1) {
      this.clientUserMapList[ind].ischecked = !e.ischecked;
    }
  };
  // onClickSubmenu = (e, d) => {
  //   let ind = this.clientMenuMapList.findIndex((d) => {
  //     return d.reportType === e.reportType;
  //   });

  //   if (ind !== -1) {
  //     let iind = this.clientMenuMapList[ind].reportList.findIndex((x) => {
  //       return x.reportid === d.reportid;
  //     });

  //     if (iind !== -1) {
  //       this.clientMenuMapList[ind].reportList[iind].isactive = !d.isactive;
  //       let check = this.clientMenuMapList[ind].reportList.filter((c) => c.isactive);
  //       if (check?.length > 0) {
  //         this.clientMenuMapList[ind].isactive = true;
  //       } else {
  //         this.clientMenuMapList[ind].isactive = false;
  //       }
  //     }
  //   }
  // };
}
