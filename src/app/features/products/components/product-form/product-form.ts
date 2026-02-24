import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/products.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private fb = inject(FormBuilder);

  private _product = signal<Product | null>(null);
  readonly productSignal = this._product.asReadonly();

  readonly isEdit = signal(false);

  @Input() set product(value: Product | null) {
    this._product.set(value);
    this.isEdit.set(!!value);

    if (value) {
      this.form.patchValue(value);
    }
  }

  @Output() save = new EventEmitter<Product>();

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    category: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    discount_percentage: [0, [Validators.min(0), Validators.max(100)]],
    rating: [0, [Validators.min(0), Validators.max(5)]],
    stock: [0, [Validators.min(0)]],
    brand: [''],
    sku: [''],
    weight: [0, [Validators.min(0)]],
    warranty_information: [''],
    shipping_information: [''],
    availability_status: ['In Stock'],
    return_policy: [''],
    minimum_order_quantity: [1, [Validators.min(1)]],
    tags: [[]],
    images: [[]],
    dimensions: this.fb.group({
      width: [0],
      height: [0],
      depth: [0],
    }),
    reviews: [[]],
    meta: this.fb.group({
      barcode: [''],
      qrCode: [''],
      createdAt: [''],
      updatedAt: [''],
    }),
    thumbnail: [''],
  });

  submit() {
    if (this.form.invalid) return;

    const updatedProduct: Product = this.isEdit()
      ? {
          ...this._product()!,
          ...this.form.value,
          updated_at: new Date().toISOString(),
        }
      : {
          ...this.form.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    this.save.emit(updatedProduct);
  }
}
