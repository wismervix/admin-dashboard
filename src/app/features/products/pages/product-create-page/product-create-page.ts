import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../../../core/models/products.model';
import { ProductForm } from '../../components/product-form/product-form';

@Component({
  selector: 'app-product-create-page',
  imports: [ProductForm],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.scss',
})
export class ProductCreatePage {
  private router = inject(Router);
  private productService = inject(ProductService);

  // handleCreate(product: Product) {
  // this.productService.createProduct(product).subscribe({
  //   next: (res) => this.router.navigate(['/products']),
  //   error: (err) => console.error(err),
  // });
  handleCreate(data: any) {
    this.productService.createProduct(data.product).subscribe({
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
      error: (err) => console.error(err),
    });
  }
}
