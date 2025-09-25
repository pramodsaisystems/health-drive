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
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, NzTabsModule, PowerBIEmbedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent {
  selectedPage: number = 0;
  menuList = [];

  constructor(private message: NzMessageService) {}
  ngOnInit() {}

  log(args: any[]): void {
    console.log(args);
  }

  onSelectedIndexChange = (e) => {};
}
