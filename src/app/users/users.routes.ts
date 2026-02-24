import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list-page/user-list-page').then(
        (m) => m.UserListPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/user-edit-page/user-edit-page').then(
        (m) => m.UserEditPage,
      ),
  },
];
