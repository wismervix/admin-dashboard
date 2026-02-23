import { Component, computed, inject } from '@angular/core';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-list-page',
  imports: [],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
})
export class ProductListPage {
  public productService = inject(ProductService);

  products = computed(() => this.productService.products());
  currentPage = computed(() => this.productService.currentPageIndex);
  totalPages = computed(() => this.productService.totalPages);

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
}
