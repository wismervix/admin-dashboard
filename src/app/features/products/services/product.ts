import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ProductsApiResponse } from '../../../core/models/products.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private productsUrl = 'https://dummyjson.com/products';

  // Pagination state
  private skipSignal = signal(0);
  private limit = 30;

  // Internal subject for reactive HTTP
  private productsSubject = new BehaviorSubject<ProductsApiResponse>({
    products: [],
    total: 0,
    skip: 0,
    limit: this.limit,
  });

  productsResponse = signal(this.productsSubject.value);

  products = computed(() => this.productsResponse().products);

  constructor() {
    // Whenever skip changes, fetch new page
    effect(() => {
      const skip = this.skipSignal();
      this.http
        .get<ProductsApiResponse>(
          `${this.productsUrl}?limit=${this.limit}&skip=${skip}`,
        )
        .pipe(
          tap((res) => {
            this.productsSubject.next(res);
            this.productsResponse.set(res);
          }),
        )
        .subscribe();
    });
  }

  // Navigation helpers
  nextPage() {
    const nextSkip = this.skipSignal() + this.limit;
    if (nextSkip < this.productsResponse().total) {
      this.skipSignal.set(nextSkip);
    }
  }

  prevPage() {
    const prevSkip = this.skipSignal() - this.limit;
    if (prevSkip >= 0) {
      this.skipSignal.set(prevSkip);
    }
  }

  goToPage(pageIndex: number) {
    const skip = pageIndex * this.limit;
    if (skip >= 0 && skip < this.productsResponse().total) {
      this.skipSignal.set(skip);
    }
  }

  get totalPages() {
    return Math.ceil(this.productsResponse().total / this.limit);
  }

  get currentPageIndex() {
    return Math.floor(this.skipSignal() / this.limit);
  }
}
