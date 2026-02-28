import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  Product,
  ProductsApiResponse,
} from '../../../core/models/products.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
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

  productsResponse = signal<ProductsApiResponse>({ products: [] });

  // products = computed(() => this.productsResponse().products);

  // Computed list of products for the current page
  readonly products = computed(() => {
    const allProducts = this.productsResponse().products;
    const skip = this.skipSignal();
    return allProducts.slice(skip, skip + this.limit);
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.productsResponse().products.length / this.limit),
  );

  readonly currentPageIndex = computed(() =>
    Math.floor(this.skipSignal() / this.limit),
  );

  constructor() {
    this.http
      .get<ProductsApiResponse>(this.productsUrl)
      .pipe(tap((res) => this.productsResponse.set(res)))
      .subscribe();
  }

  getProductById(id: number): Product | undefined {
    return this.productsResponse().products.find((p) => p.id === id);
  }

  uploadImages(
    productId: number,
    thumbnail?: File,
    images?: File[],
    removedImages?: string[],
  ) {
    const formData = new FormData();

    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    images?.forEach((img) => {
      formData.append('images[]', img);
    });

    removedImages?.forEach((img) => formData.append('removedImages[]', img));

    return this.http
      .post<{
        product: Product;
      }>(`${this.productsUrl}/${productId}/images`, formData)
      .pipe(
        tap((res) => {
          const updated = this.productsResponse().products.map((p) =>
            p.id === productId ? res.product : p,
          );

          this.productsResponse.set({
            products: updated,
          });
        }),
      );
  }

  updateProduct(updatedProduct: Product) {
    return this.http
      .put<{
        product: Product;
      }>(`${this.productsUrl}/${updatedProduct.id}`, updatedProduct)
      .pipe(
        tap((res) => {
          const updatedProducts = this.productsResponse().products.map((u) =>
            u.id === updatedProduct.id ? res.product : u,
          );

          this.productsResponse.set({ products: updatedProducts });
        }),
      );
  }

  createProduct(newProduct: Product) {
    return this.http
      .post<{ product: Product }>(this.productsUrl, newProduct)
      .pipe(
        tap((res) => {
          // Add the new product to the local signal state
          const updatedProducts = [
            ...this.productsResponse().products,
            res.product,
          ];
          this.productsResponse.set({ products: updatedProducts });
        }),
      );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.productsUrl}/${id}`).pipe(
      tap(() => {
        const filteredProducts = this.productsResponse().products.filter(
          (p) => p.id !== id,
        );

        this.productsResponse.set({ products: filteredProducts });
      }),
    );
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
}
