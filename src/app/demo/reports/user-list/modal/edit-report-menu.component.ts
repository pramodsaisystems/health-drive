import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { put } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
@Component({
  selector: 'edit-report-menu-modal',
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
    NzCheckboxComponent
  ],
  templateUrl: './edit-report-menu.component.html'
})
export class EditReportMenuModalComponent {
  constructor(private message: NzMessageService) {}
  @Input() isVisible = false;
  @Input() selectedRow: any = [];
  @Input() selectedClientRow: any = [];
  @Input() reportMenuMapList: any[] = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();

  ngOnChanges() {}

  handleOk = async () => {
    let res: any = await put(APP_API_URL + 'UserMenuMapping/UpdateMenusPerUser/' + this?.selectedRow?.userId, this.reportMenuMapList);
    if (res?.status === 204) {
      this.message.create('success', 'Report mapping updated successfully!');
      this.closeModalEvent.emit(true);
    } else {
      this.message.create('error', 'Error while updating report mapping!');
    }
    // this.closeModalEvent.emit(false);
  };

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  onClickMenu = (e) => {
    let ind = this.reportMenuMapList.findIndex((d) => {
      return d.menuid === e.menuid;
    });

    if (ind !== -1) {
      this.reportMenuMapList[ind].isactive = !e.isactive;
      if (this?.reportMenuMapList[ind]?.subMenuMasterListDTO?.length > 0) {
        this.reportMenuMapList[ind].subMenuMasterListDTO.map((x) => {
          x.isactive = e.isactive;
        });
      }
    }
  };
  onClickSubmenu = (e, d) => {
    let ind = this.reportMenuMapList.findIndex((d) => {
      return d.menuid === e.menuid;
    });

    if (ind !== -1) {
      let iind = this.reportMenuMapList[ind].subMenuMasterListDTO.findIndex((x) => {
        return x.submenuid === d.submenuid;
      });

      if (iind !== -1) {
        this.reportMenuMapList[ind].subMenuMasterListDTO[iind].isactive = !d.isactive;
        let check = this.reportMenuMapList[ind].subMenuMasterListDTO.filter((c) => c.isactive);
        if (check?.length > 0) {
          this.reportMenuMapList[ind].isactive = true;
        } else {
          this.reportMenuMapList[ind].isactive = false;
        }
      }
    }
  };
}
