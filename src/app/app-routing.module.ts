import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component')
      },
      // {
      //   path: 'ref-dashboard',
      //   loadComponent: () => import('./demo/referral/referral-files.component')
      // },
      {
        path: 'BotQueue/Index',

        loadComponent: () => import('./demo/referral/referral-files.component'),
        pathMatch: 'prefix'
      },
      {
        path: 'BotQueue/Details',
        loadComponent: () => import('./demo/detailsfilelist/details-file-list.component')
      },
      {
        path: 'dashboard/:reportid',
        loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'dashboard/:reportid/:abbr',
        loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      {
        path: 'user-list',
        loadComponent: () => import('./demo/reports/user-list/user-list.component')
      },
      {
        path: 'client-list',
        loadComponent: () => import('./demo/reports/client-list/client-list.component')
      },
      {
        path: 'role-list',
        loadComponent: () => import('./demo/reports/role/role.component')
      },
      {
        path: 'activity-log',
        loadComponent: () => import('./demo/reports/activity-log/activity-log.component')
      },
      {
        path: 'report-list',
        loadComponent: () => import('./demo/reports/report-list/report-list.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
