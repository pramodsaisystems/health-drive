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
  selector: 'edit-role-menu-modal',
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
  templateUrl: './edit-role-menu.component.html'
})
export class EditRoleMenuModalComponent {
  constructor(private message: NzMessageService) {}
  @Input() isVisible = false;
  @Input() selectedRow: any = [];
  @Input() roleMenuMapList: any[] = [];
  @Output() closeModalEvent = new EventEmitter<boolean>();

  ngOnChanges() {}

  handleOk = async () => {
    let res: any = await put(APP_API_URL + 'RoleMenuMapping/UpdateMenusPerRole/' + this.selectedRow.userroleid, this.roleMenuMapList);
    if (res?.status === 204) {
      this.message.create('success', 'Role mapping updated successfully!');
      this.closeModalEvent.emit(true);
    } else {
      this.message.create('error', 'Error while updating role mapping!');
    }
    // this.closeModalEvent.emit(false);
  };

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  onClickMenu = (e) => {
    let ind = this.roleMenuMapList.findIndex((d) => {
      return d.menuid === e.menuid;
    });

    if (ind !== -1) {
      this.roleMenuMapList[ind].isactive = !e.isactive;
      if (this?.roleMenuMapList[ind]?.subMenuMasterListDTO?.length > 0) {
        this.roleMenuMapList[ind].subMenuMasterListDTO.map((x) => {
          x.isactive = e.isactive;
        });
      }
    }
  };
  onClickSubmenu = (e, d) => {
    let ind = this.roleMenuMapList.findIndex((d) => {
      return d.menuid === e.menuid;
    });

    if (ind !== -1) {
      let iind = this.roleMenuMapList[ind].subMenuMasterListDTO.findIndex((x) => {
        return x.submenuid === d.submenuid;
      });

      if (iind !== -1) {
        this.roleMenuMapList[ind].subMenuMasterListDTO[iind].isactive = !d.isactive;
        let check = this.roleMenuMapList[ind].subMenuMasterListDTO.filter((c) => c.isactive);
        if (check?.length > 0) {
          this.roleMenuMapList[ind].isactive = true;
        } else {
          this.roleMenuMapList[ind].isactive = false;
        }
      }
    }
  };
}
