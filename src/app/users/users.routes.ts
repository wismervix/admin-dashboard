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
    path: 'new',
    loadComponent: () =>
      import('./pages/user-form-page/user-form-page').then(
        (m) => m.UserFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/user-form-page/user-form-page').then(
        (m) => m.UserFormPage,
      ),
  },
];
