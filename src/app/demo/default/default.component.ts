// Angular Import
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BajajChartComponent } from './bajaj-chart/bajaj-chart.component';
import { ChartDataMonthComponent } from './chart-data-month/chart-data-month.component';
import { get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { PowerBIEmbedModule } from 'powerbi-client-angular';

import * as powerbi from 'powerbi-client';
import { IReportEmbedConfiguration, IEmbedConfiguration, models } from 'powerbi-client';
// import { DataSharingService } from 'src/utils/broadcast-service';
// import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataSharingService } from 'src/utils/broadcast-service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule, SharedModule, BajajChartComponent, BarChartComponent, ChartDataMonthComponent, PowerBIEmbedModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  @ViewChild('myIframe') iframe!: ElementRef;
  reportConfig: any;
  userRolesData: any = [];
  // subscription: Subscription;
  reportId: string = '';
  embededToken: string = '';
  loading: boolean = false;
  title: string = 'Dashboard';
  private abortController: AbortController | null = null;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private dataSharingService: DataSharingService
  ) {
    this.reportConfig = {
      type: 'report', // You can use 'dashboard' or 'tile' based on your need
      id: '', // Replace with your Power BI report ID
      embedUrl: '',
      accessToken: '', // Replace with your Power BI access token
      tokenType: models.TokenType.Embed,
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
        panes: {
          filters: {
            expanded: false,
            visible: false
          },
          pageNavigation: {
            visible: false
          }
        },
        background: models.BackgroundType.Transparent
      },
      filters: []
    };
  }

  ngOnInit() {
    // localStorage.setItem('dashboard', 'Dashboard');
    this.reportId = '';
    this.embededToken = '';
    this.getUserRolesDrpDwnData();
    this.route.paramMap.subscribe((params: any) => {
      this.reportId = params?.params?.reportid;
      if (this.reportId) {
        this.getEmabededToken(this.reportId);
        if (localStorage.getItem('menudata')) {
          let menudata = JSON.parse(localStorage.getItem('menudata'));
          menudata?.map((d) => {
            if (d?.children?.length > 0) {
              d?.children?.map((x) => {
                if (x.url.indexOf(this.reportId) > 0) {
                  this.title = x.title;
                  sessionStorage.setItem('dashboard', x.title);
                }
              });
            } else if (d.url.indexOf(this.reportId) > 0) {
              this.title = d.title;
              sessionStorage.setItem('dashboard', d.title);
            }
          });
        }
      }
    });

    // this.subscription = this.dataSharingService.dashService.subscribe((data) => {
    //   if (data) {
    //   }
    // });
  }
  // ngAfterViewInit() {
  //   const iframeElement = this.iframe.nativeElement;

  //   // Ensure iframe content is loaded
  //   iframeElement.onload = () => {
  //     const iframeWindow = iframeElement.contentWindow;

  //     if (iframeWindow) {
  //       // Add a click event listener
  //       iframeWindow.document.addEventListener('click', (event: Event) => {
  //         console.log('Click detected inside iframe:', event);
  //       });

  //       // Add a keydown event listener
  //       iframeWindow.document.addEventListener('keydown', (event: KeyboardEvent) => {
  //         console.log('Keydown detected inside iframe:', event.key);
  //       });
  //     }
  //   };
  // }
  ngOnDestroy() {
    if (sessionStorage.getItem('dashboard')) {
      sessionStorage.removeItem('dashboard');
    }
    if (localStorage.getItem('menutype')) {
      // localStorage.removeItem('menutype');
    }

    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }
  getUserRolesDrpDwnData = async () => {
    let res: any = await get(APP_API_URL + 'UserRoles/GetUserRolesDropdown');
    if (res?.status === 200) {
      this.userRolesData = res.data;
    }
  };

  onReportLoaded(event: any) {
    console.log('Report loaded successfully', event);
  }

  onReportRendered(event: any) {
    console.log('Report rendered successfully', event);
  }

  getEmabededToken = async (reportId) => {
    // Cancel previous request if it exists
    if (this.abortController) {
      this.embededToken = '';
      this.abortController.abort();
    }

    // Create a new AbortController for the new request
    this.abortController = new AbortController();
    let res = await get(APP_API_URL + 'PowerBi/' + reportId + '?clientId=' + localStorage.getItem('clientId'), {
      signal: this.abortController.signal
    });
    this.loading = true;
    console.log(res);
    if (res?.status === 200) {
      let abbrRPT = localStorage.getItem('abbr') ? localStorage.getItem('abbr') : '';
      this.reportConfig.accessToken = res?.data?.embedToken;
      let userData = JSON.parse(localStorage.getItem('userInfo'));

      // let AssignedProviders = userData?.AssignedProviders.length > 0 ? userData?.AssignedProviders.split(',') : [];
      // let AssignedServiceLocations = userData?.AssignedServiceLocations.length > 0 ? userData?.AssignedServiceLocations.split(',') : [];
      // let AssignedStates = userData?.AssignedStates.length > 0 ? userData?.AssignedStates.split(',') : [];
      let clientId = localStorage.getItem('clientId');

      if (localStorage.getItem('menutype') === 'dashboard' && clientId !== '0') {
        // this.reportConfig.embedUrl = res?.data?.embedUrl + '&filter=Accounts%2FaccountAbbreviation%20eq%20' + `%27${abbrRPT}%27`;
        this.reportConfig.embedUrl = this.returnURL(res?.data?.embedUrl);

        const filters = res?.data?.reportFilters?.map((data) => {
          return this.getBIConfig(data?.filterField?.split('/')[0], data?.filterField?.split('/')[1], data.filterValues.split(','));
        });
        if (filters.length > 0) {
          this.reportConfig.filters = filters;
        }
      } else if (localStorage.getItem('menutype') && localStorage.getItem('menutype').indexOf('pacehr') != -1) {
        this.reportConfig.embedUrl = res?.data?.embedUrl + encodeURI(`&rp:AccountName=${abbrRPT}`).replace(/'/g, '%27');
      } else if (localStorage.getItem('menutype') && localStorage.getItem('menutype').indexOf('standard') != -1) {
        this.reportConfig.embedUrl = res?.data?.embedUrl + encodeURI(`&rp:AccountName=${abbrRPT}`).replace(/'/g, '%27');
      } else {
        this.reportConfig.embedUrl =
          res?.data?.embedUrl + encodeURI(`&filter=Accounts/accountAbbreviation eq '${abbrRPT}'`).replace(/'/g, '%27');
        // this.reportConfig.embedUrl = res?.data?.embedUrl + "&rp:AccountName=GM";
      }

      this.reportConfig.id = reportId;
      console.log(this.reportConfig);
      this.embededToken = res?.data?.embedToken;
    } else {
      if (res?.code === 'ERR_CANCELED') {
        //do nothing
      } else {
        this.message.create('error', 'Error while creating embeded token.');
      }
    }
    this.loading = false;
  };

  getBIConfig = (table, column, value) => {
    return {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: table, // Change to your actual table name
        column: column // Filter by the 'Country' column
      },
      operator: 'In',
      values: value // Value to filter by
    };
  };

  returnURL = (embedUrl) => {
    let abbrRPT = localStorage.getItem('abbr') ? localStorage.getItem('abbr') : '';
    if (abbrRPT === 'MIS' || abbrRPT === 'RCM' || abbrRPT === 'Infrastructure') {
      return embedUrl;
    } else {
      return embedUrl + encodeURI(`&filter=Accounts/accountAbbreviation eq '${abbrRPT}'`).replace(/'/g, '%27');
    }
  };
  onReportClick = () => {
    this.dataSharingService.updateIdleService('yes');
  };
}
