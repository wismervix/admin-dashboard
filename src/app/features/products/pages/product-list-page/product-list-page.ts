import { Component, computed, inject } from '@angular/core';
import { ProductsStore } from '../../data/products.store';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { Card } from '../../../../shared/components/card/card';
import { DataTable } from '../../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-product-list-page',
  imports: [RouterModule, Card, DataTable],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage {
  public productsStore = inject(ProductsStore);
  public apiService = inject(ApiService);

  products = this.productsStore.products;
  currentPage = this.productsStore.currentPageIndex;
  totalPages = this.productsStore.totalPages;

  nextPage() {
    this.productsStore.nextPage();
  }

  prevPage() {
    this.productsStore.prevPage();
  }

  goToPage(page: number) {
    this.productsStore.goToPage(page);
  }

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  deleteProduct(id: number) {
    const confirmed = confirm('Are you sure you want to delete this product?');

    if (!confirmed) return;

    this.productsStore.deleteProduct(id).subscribe({
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
}
