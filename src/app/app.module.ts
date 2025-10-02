import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLogoComponent } from './theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { IconModule } from '@ant-design/icons-angular';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyPolicyModalComponent } from './demo/pages/authentication/login/modal/policy.component';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { ChangePasswordModalComponent } from './component/modal/change-password.component';
import { TFAModalComponent } from './component/modal/tfa-modal.component';
import { TFAAuthComponent } from './demo/pages/authentication/login/component/tfa-screen/tfa-auth.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ArrowLeftOutline, ArrowRightOutline } from '@ant-design/icons-angular/icons';
const ngZorroConfig: NzConfig = {
  message: { nzTop: 90 },
  notification: { nzTop: 240 }
};
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    GuestComponent,
    ChangePasswordModalComponent,
    TFAModalComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    DemoNgZorroAntdModule,
    IconModule,
    HttpClientModule,
    PrivacyPolicyModalComponent,
    PowerBIEmbedModule,
    TFAAuthComponent,
    NzIconModule.forRoot([ArrowLeftOutline])
  ],
  providers: [NavigationItem, provideNzConfig(ngZorroConfig)],
  bootstrap: [AppComponent]
})
export class AppModule {}
