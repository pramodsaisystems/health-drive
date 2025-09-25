// Angular import
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataSharingService } from 'src/utils/broadcast-service';
import { SharedService } from 'src/app/activity.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  constructor(
    private router: Router,
    private message: NzMessageService,
    private dataSharingService: DataSharingService,
    private sharedService: SharedService,
    private ngZone: NgZone
  ) {}

  username = '';
  email = '';
  clientsList: any[] = [];
  selectedClient: string = '';
  isCPVisible = false;
  isTFAVisible = false;
  showTFA = false;
  mfaEnabled = localStorage.getItem('regTFA') ? localStorage.getItem('regTFA') === 'yes' : false;
  subscription: Subscription;
  ngOnInit() {
    if (localStorage.getItem('userInfo')) {
      let userData = JSON.parse(localStorage.getItem('userInfo'));
      this.username = userData?.FirstName + ' ' + userData?.LastName;
      this.email = userData?.EmailId;
      this.selectedClient = userData?.ClientId;

      //this.showTFA = userData?.role?.toLowerCase() === 'super admin';
    }
    // if (localStorage.getItem('role') === 'Super Admin') {
    this.getClientsList(false);
    // }

    this.subscription = this.dataSharingService.regTFAService$.subscribe((data) => {
      if (data === 'yes') {
        this.mfaEnabled = true;
      }
    });

    this.subscription = this.dataSharingService.updateClients$.subscribe((data) => {
      if (data) {
        this.getClientsList(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.dataSharingService.clearRegTFA();
      this.dataSharingService.clearClientService();
    }
  }

  onSelectedClient = (e) => {
    this.selectedClient = e;
    const foundItem = this.clientsList.find((item) => item.id === parseInt(e));
    if (foundItem?.abbreviation) {
      localStorage.setItem('abbr', foundItem?.abbreviation);
      localStorage.setItem('clientId', e);
    }

    this.dataSharingService.updateData({ id: e, refresh: false });
  };

  getClientsList = async (update) => {
    let res: any = await get(APP_API_URL + 'Clients/GetClientsDropdown');
    if (res?.status === 200) {
      this.clientsList = res.data;
      if (this.clientsList.length > 0 && !update) {
        let urlAbbrId = null;
        let urlAbbr = null;
        if (!update) {
          urlAbbrId =
            localStorage.getItem('clientId') && localStorage.getItem('clientId') !== '0' ? localStorage.getItem('clientId') : null;
          urlAbbr = localStorage.getItem('abbr') ? localStorage.getItem('abbr') : null;
        }
        if (localStorage.getItem('role') === 'Super Admin') {
          localStorage.setItem('abbr', urlAbbr ? urlAbbr : this.clientsList[0].abbreviation);
          localStorage.setItem('clientId', urlAbbrId ? urlAbbrId : this.clientsList[0].id);

          this.dataSharingService.updateData({
            id: urlAbbrId ? urlAbbrId.toString() : this.clientsList[0].id.toString(),
            refresh: false,
            init: update
          });
          this.selectedClient = urlAbbrId ? urlAbbrId.toString() : this.clientsList[0].id.toString();
        } else {
          let ind = this.clientsList.findIndex((d) => d.isDefault);
          if (ind !== -1) {
            localStorage.setItem('abbr', urlAbbr ? urlAbbr : this.clientsList[ind].abbreviation);
            localStorage.setItem('clientId', urlAbbrId ? urlAbbrId : this.clientsList[ind].id);

            this.dataSharingService.updateData({
              id: urlAbbrId ? urlAbbrId.toString() : this.clientsList[ind].id.toString(),
              refresh: false,
              init: update
            });
            this.selectedClient = urlAbbrId ? urlAbbrId.toString() : this.clientsList[ind].id.toString();
          }
        }
      }
    }
  };

  onLogoutClick = async () => {
    let res: any = await get(APP_API_URL + 'Auth/Logout?userLoginInfoId=' + localStorage.getItem('userLoginInfoId'));

    if (res?.status === 200) {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/guest/login']);
    } else {
      this.message.create('error', res?.data?.message);
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/guest/login']);
    }
  };

  onChangePwd = () => {
    this.sharedService.auditLog('change password');
    this.isCPVisible = true;
  };

  onCPCloseModalEvent = (e) => {
    this.isCPVisible = false;
  };

  onTFASettings = () => {
    // this.sharedService.auditLog('TFA settings');
    this.isTFAVisible = true;
  };

  onTFACloseModalEvent = (e) => {
    this.isTFAVisible = false;
  };
}
