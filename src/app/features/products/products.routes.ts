import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page').then(
        (m) => m.ProductListPage,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page').then(
        (m) => m.ProductFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page').then(
        (m) => m.ProductFormPage,
      ),
  },
];
