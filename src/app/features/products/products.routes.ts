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
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/product-edit-page/product-edit-page').then(
        (m) => m.ProductEditPage,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/product-create-page/product-create-page').then(
        (m) => m.ProductCreatePage,
      ),
  },
];
