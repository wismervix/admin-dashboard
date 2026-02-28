import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../../../core/models/products.model';
import { ProductForm } from '../../components/product-form/product-form';

@Component({
  selector: 'app-product-edit-page',
  imports: [ProductForm],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.scss',
})
export class ProductEditPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundProduct = this.productService.getProductById(id);

    if (foundProduct) {
      this.product.set(foundProduct);
    } else {
      this.router.navigate(['/products']);
    }
  }

  handleUpdate(data: any) {
    this.productService.updateProduct(data.product).subscribe({
      next: (res) => {
        const productId = res.product.id;

        if (
          data.thumbnail ||
          data.images?.length ||
          data.removedImages?.length
        ) {
          this.productService
            .uploadImages(
              productId,
              data.thumbnail,
              data.images,
              data.removedImages,
            )
            .subscribe(() => this.router.navigate(['/products']));
        } else {
          this.router.navigate(['/products']);
        }
      },
    });
    // handleUpdate(updatedProduct: Product) {
    // this.productService.updateProduct(updatedProduct).subscribe({
    //   next: () => this.router.navigate(['/products']),
    //   error: (err) => console.error(err),
    // });
  }
}
