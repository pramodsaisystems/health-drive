import { Component, Input, Output, EventEmitter } from '@angular/core';
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
import { EditClientUserDashModalComponent } from './edit-client-user-dash.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'edit-client-menu-modal',
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
    EditClientUserDashModalComponent,
    CommonModule
  ],
  templateUrl: './edit-client-menu.component.html'
})
export class EditClientMenuModalComponent {
  constructor(
    private message: NzMessageService,
    private dataSharingService: DataSharingService
  ) {}
  @Input() isVisible = false;
  @Input() selectedRow: any = [];
  @Input() clientMenuMapList: any[] = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();
  isCUDVisible = false;
  selectedReportId = 0;
  selectedReportName = '';

  ngOnChanges() {}

  handleOk = async () => {
    let res: any = await put(
      APP_API_URL + 'ReportClientMapping/UpdateReportsPerClient/' + this.selectedRow.clientid,
      this.clientMenuMapList
    );
    if (res?.status === 204) {
      this.dataSharingService.updateData({ id: localStorage.getItem('clientId'), refresh: true });
      this.message.create('success', 'Client menu mapping updated successfully!');
      this.closeModalEvent.emit(true);
    } else {
      this.message.create('error', 'Error while updating client menu mapping!');
    }
    // this.closeModalEvent.emit(false);
  };

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  onClickMenu = (e) => {
    let ind = this.clientMenuMapList.findIndex((d) => {
      return d.reportType === e.reportType;
    });

    if (ind !== -1) {
      this.clientMenuMapList[ind].isactive = !e.isactive;
      if (this?.clientMenuMapList[ind]?.reportList?.length > 0) {
        this.clientMenuMapList[ind].reportList.map((x) => {
          x.isactive = e.isactive;
        });
      }
    }
  };
  onClickSubmenu = async (e, d) => {
    if (!d.isactive) {
      let res: any = await get(APP_API_URL + 'Users/IsUserExists/' + this.selectedRow.clientid);
      if (res?.status === 200 && res?.data) {
        this.isCUDVisible = true;
        this.selectedReportId = d?.reportid;
        this.selectedReportName = d?.reportname;
      }
    }

    let ind = this.clientMenuMapList.findIndex((d) => {
      return d.reportType === e.reportType;
    });

    if (ind !== -1) {
      let iind = this.clientMenuMapList[ind].reportList.findIndex((x) => {
        return x.reportid === d.reportid;
      });

      if (iind !== -1) {
        this.clientMenuMapList[ind].reportList[iind].isactive = !d.isactive;
        let check = this.clientMenuMapList[ind].reportList.filter((c) => c.isactive);
        if (check?.length > 0) {
          this.clientMenuMapList[ind].isactive = true;
        } else {
          this.clientMenuMapList[ind].isactive = false;
        }
      }
    }
  };

  onCUDMCloseModalEvent = (e) => {
    this.isCUDVisible = false;
  };
}
