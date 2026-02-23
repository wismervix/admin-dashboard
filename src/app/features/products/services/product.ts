import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ProductsApiResponse } from '../../../core/models/products.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  private productsUrl = `${this.apiService.baseUrl}/products`;

  // Pagination state
  private skipSignal = signal(0);
  private limit = 30;

  // Internal subject for reactive HTTP
  private productsSubject = new BehaviorSubject<ProductsApiResponse>({
    products: [],
  });

  productsResponse = signal(this.productsSubject.value);

  // products = computed(() => this.productsResponse().products);

  // Computed list of products for the current page
  products = computed(() => {
    const allProducts = this.productsResponse().products;
    const skip = this.skipSignal();
    return allProducts.slice(skip, skip + this.limit);
  });

  constructor() {
    effect(() => {
      // Only need to fetch once, or you can fetch fresh if your API supports pagination
      this.http
        .get<ProductsApiResponse>(this.productsUrl)
        .pipe(
          tap((res) => {
            this.productsSubject.next(res);
            this.productsResponse.set(res);
            // console.log('products res: ', this.productsResponse());
          }),
        )
        .subscribe();
    });
  }

  nextPage() {
    const nextSkip = this.skipSignal() + this.limit;
    if (nextSkip < this.productsResponse().products.length) {
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
    const newSkip = pageIndex * this.limit;
    if (newSkip >= 0 && newSkip < this.productsResponse().products.length) {
      this.skipSignal.set(newSkip);
    }
  }

  get totalPages() {
    return Math.ceil(this.productsResponse().products.length / this.limit);
  }

  get currentPageIndex() {
    return Math.floor(this.skipSignal() / this.limit);
  }
}
