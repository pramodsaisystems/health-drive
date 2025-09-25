// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ViewEditClientModalComponent } from './modal/view-edit-client.component';
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
import { EditClientMenuModalComponent } from './modal/edit-client-menu.component';
import { EditNewClientMenuModalComponent } from './modal/edit-new-client-menu.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { InformationModalComponent } from 'src/app/component/modal/information.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SharedService } from 'src/app/activity.service';
import { DataSharingService } from 'src/utils/broadcast-service';

interface Client {
  clientid: number;
  clientshortname: string;
  clientname: string;
  isactive: boolean;
  isshowinddl: boolean;
  currentUserId: number;
  sessionTimeout: string;
}

@Component({
  selector: 'adm-client-list',
  standalone: true,
  imports: [
    SharedModule,
    NzTableModule,
    NzIconModule,
    ViewEditClientModalComponent,
    NzSwitchModule,
    NzPopconfirmModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzSelectModule,
    NzButtonModule,
    EditClientMenuModalComponent,
    NzToolTipModule,
    InformationModalComponent,
    EditNewClientMenuModalComponent
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export default class UserListComponent {
  isVisible = false;
  selectedRow = [];
  type = 'Add';
  clientList: Client[] = [];
  loading = false;
  isERMVisible = false;
  clientMenuMapList = [];
  isIMVisible = false;
  selectedClient = 0;
  constructor(
    private message: NzMessageService,
    private fb: NonNullableFormBuilder,
    private md: NzModalService,
    private sharedService: SharedService,
    private dataSharingService: DataSharingService
  ) {
    this.validateForm = this.fb.group({
      search: [''],

      status: ['']
    });
  }

  validateForm: FormGroup<{
    search: FormControl<string>;

    status: FormControl<string>;
  }>;

  ngOnInit() {
    sessionStorage.setItem('dashboard', 'Clients');
    this.selectedClient = localStorage.getItem('clientId') ? parseInt(localStorage.getItem('clientId')) : 0;
    this.getClientListData();
  }

  sortClientNameFn = (a: Client, b: Client): any => a.clientname.localeCompare(b.clientname);
  sortClientShortNameFn = (a: Client, b: Client): any => a.clientshortname.localeCompare(b.clientshortname);
  sortClientIdFn = (a: Client, b: Client): any => a.clientid - b.clientid;
  sortActiveFn = (a: Client, b: Client): any => !a.isactive && b.isactive;
  getClientListData = async () => {
    this.loading = true;
    let res: any = await get(
      APP_API_URL +
        'Clients?pageSize=500&pageNumber=0&searchText=' +
        this.validateForm.value.search +
        '&isActive=' +
        (this.validateForm.value.status === '' ? '' : this.validateForm.value.status === '1' ? true : false)
    );
    this.loading = false;
    if (res?.status === 200) {
      this.clientList = res?.data?.clientList;
    }
  };

  showModal = (data, type) => {
    this.sharedService.auditLog('Edit Client');
    this.isVisible = true;
    this.selectedRow = data;
    this.type = type;
  };

  onCloseModalEvent = (event) => {
    this.isVisible = false;
    if (event) {
      this.getClientListData();
    }
  };

  onERMCloseModalEvent = (event) => {
    this.isERMVisible = false;
  };

  deleteClient = async (id) => {
    this.sharedService.auditLog('Delete Client');
    let res: any = await deleteAPI(APP_API_URL + 'Clients/' + id);
    if (res?.status === 204) {
      this.message.create('success', 'Client deleted successfully!');
      this.getClientListData();
      this.dataSharingService.updateClientService(id);
    } else if (res?.status === 409) {
      this.message.create('error', res?.response?.data);
    } else {
      this.message.create('error', 'Unable to delete client!');
    }
  };

  onAddNewClient = () => {
    this.sharedService.auditLog('Add Client');
    this.isVisible = true;
    this.selectedRow = [];
    this.type = 'Add';
  };

  onToggleClick = async (data) => {
    this.sharedService.auditLog('Edit Client');
    this.loading = true;
    let payload = {
      clientid: data.clientid,
      clientshortname: data.clientshortname,
      clientname: data.clientname,
      isactive: !data.isactive,
      isshowinddl: data.isshowinddl,
      currentUserId: localStorage.getItem('currentUserId') ? localStorage.getItem('currentUserId') : 0
    };
    let res: any = await put(APP_API_URL + 'Clients/' + data.clientid, payload);
    this.loading = false;
    if (res?.status === 204) {
      this.message.create('success', 'Client updated successfully!');
      this.getClientListData();
    } else {
      this.message.create('error', 'Error while updating client!');
    }
  };
  cancel() {}

  submitForm = async () => {
    if (this.validateForm.valid) {
      this.getClientListData();
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

      status: ''
    });
    this.getClientListData();
  };

  editClientMenuMapping = async (data) => {
    this.sharedService.auditLog('Edit Client Menu Mapping');
    this.clientMenuMapList = [];
    let res: any = await get(APP_API_URL + 'ReportClientMapping?clientId=' + data?.clientid + '&pageSize=0&pageNumber=1000');
    if (res?.status === 200) {
      let updatedArr = res.data.reportClientMappingList.map((data) => {
        let newRep = data.reportList.sort((a, b) => {
          return a.isactive === b.isactive ? 0 : a.isactive ? -1 : 1;
        });

        data.reportList = newRep;
        return data;
      });

      this.clientMenuMapList = updatedArr;
      this.isERMVisible = true;
      this.selectedRow = data;
    }
  };

  onInfoClick() {
    this.isIMVisible = true;
  }

  onIMCloseModalEvent(e) {
    this.isIMVisible = false;
  }

  onDeleteClient = (userId) => {
    this.md.confirm({
      nzTitle: 'Are you sure you want to delete this client?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteClient(userId),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };

  onDeactivate = async (data) => {
    this.md.confirm({
      nzTitle: `Are you sure want to ${data.isactive ? 'deactivate' : 'activate'} this client?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onToggleClick(data),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  };
}
