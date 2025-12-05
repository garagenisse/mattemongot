import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-dash',
        loadComponent: () =>
          import('../tab-dash/tab-dash.page').then((m) => m.TabDashPage)
      },
      {
        path: 'tab-play',
        loadComponent: () =>
          import('../tab-play/tab-play.page').then((m) => m.TabPlayPage)
      },
      {
        path: 'tab-play/:levelIndex',
        loadComponent: () =>
          import('../tab-play/tab-play.page').then((m) => m.TabPlayPage)
      },
      {
        path: 'tab-settings',
        loadComponent: () =>
          import('../tab-settings/tab-settings.page').then((m) => m.TabSettingsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/tab-dash',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-dash',
    pathMatch: 'full'
  }
];
