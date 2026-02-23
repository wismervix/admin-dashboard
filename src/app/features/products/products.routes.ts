import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page').then((m) => m.ProductListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/product-form-page/product-form-page').then((m) => m.ProductFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/product-form-page/product-form-page').then((m) => m.ProductFormPage),
  },
];
