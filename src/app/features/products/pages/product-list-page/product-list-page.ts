import { Component, computed, inject } from '@angular/core';
import { ProductService } from '../../services/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list-page',
  imports: [RouterModule],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage {
  public productService = inject(ProductService);

  products = this.productService.products;
  currentPage = this.productService.currentPageIndex;
  totalPages = this.productService.totalPages;

  nextPage() {
    this.productService.nextPage();
  }

  prevPage() {
    this.productService.prevPage();
  }

  goToPage(page: number) {
    this.productService.goToPage(page);
  }

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  deleteProduct(id: number) {
    const confirmed = confirm('Are you sure you want to delete this product?');

    if (!confirmed) return;

    this.productService.deleteProduct(id).subscribe({
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }
}
