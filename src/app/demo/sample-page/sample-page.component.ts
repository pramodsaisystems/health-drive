// angular import
import { Component } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { PowerBIEmbedModule } from 'powerbi-client-angular';

import * as powerbi from 'powerbi-client';
import { models } from 'powerbi-client';
import { NzMessageService } from 'ng-zorro-antd/message';
import { get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
@Component({
  selector: 'app-sample-page',
  standalone: true,
  imports: [SharedModule, NzTabsModule, PowerBIEmbedModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export default class SamplePageComponent {
  selectedPage: number = 0;
  menuList = [];
  reportConfig: powerbi.IReportEmbedConfiguration;
  reportId: string = '';
  embededToken: string = '';
  loading: boolean = false;
  constructor(private message: NzMessageService) {
    this.reportConfig = {
      type: 'report', // You can use 'dashboard' or 'tile' based on your need
      id: '', // Replace with your Power BI report ID
      embedUrl: '',
      accessToken: '', // Replace with your Power BI access token
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: false
          },
          pageNavigation: {
            visible: true
          }
        }
      }
    };
  }
  ngOnInit() {
    let menu = localStorage.getItem('menudata') ? JSON.parse(localStorage.getItem('menudata')) : [];
    if (menu?.length > 0) {
      this.menuList = menu[0]?.children;
      this.reportId = '';
      this.embededToken = '';
      if (menu[0]?.children[0]?.url?.split('/')[2]) {
        this.reportId = menu[0]?.children[0].url.split('/')[2];
        this.getEmabededToken(this.reportId);
      }
    }
  }

  log(args: any[]): void {
    console.log(args);
  }

  onSelectedIndexChange = (e) => {
    this.selectedPage = e;
    if (this.menuList) {
      this.reportId = this.menuList[e]?.url.split('/')[2];
      this.getEmabededToken(this.reportId);
    }
  };

  getEmabededToken = async (reportId) => {
    this.loading = true;
    let res = await get(APP_API_URL + 'PowerBi/' + reportId);
    if (res?.status === 200) {
      let abbrRPT = localStorage.getItem('abbr') ? localStorage.getItem('abbr') : '';
      this.reportConfig.accessToken = res?.data?.embedToken;

      if (localStorage.getItem('menutype') === 'dashboard') {
        this.reportConfig.embedUrl = res?.data?.embedUrl + '&filter=Accounts%2FaccountAbbreviation%20eq%20' + `%27${abbrRPT}%27`;
      } else if (localStorage.getItem('menutype') && localStorage.getItem('menutype').indexOf('pacehr') != -1) {
        this.reportConfig.embedUrl = res?.data?.embedUrl + '&rp:AccountName=' + encodeURI(`${abbrRPT}`);
      } else if (localStorage.getItem('menutype') && localStorage.getItem('menutype').indexOf('standard') != -1) {
        this.reportConfig.embedUrl = res?.data?.embedUrl + '&rp:AccountName=' + encodeURI(`${abbrRPT}`);
      } else {
        this.reportConfig.embedUrl = res?.data?.embedUrl + '&filter=Accounts%2FaccountAbbreviation%20eq%20' + `%27${abbrRPT}%27`;
        // this.reportConfig.embedUrl = res?.data?.embedUrl + "&rp:AccountName=GM";
      }
      console.log(this.reportConfig.embedUrl);
      this.reportConfig.id = reportId;
      this.embededToken = res?.data?.embedToken;
    } else {
      this.message.create('error', 'Error while creating embeded token.');
    }
    this.loading = false;
  };

  onReportLoaded(event: any) {
    console.log('Report loaded successfully', event);
  }

  onReportRendered(event: any) {
    console.log('Report rendered successfully', event);
  }
}
