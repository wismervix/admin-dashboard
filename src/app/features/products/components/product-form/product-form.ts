import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/products.model';
import {
  FormGroup,
  FormArray,
  Validators,
  FormBuilder,
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

  private toDateTimeLocal(value?: string | Date | null): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);

    return local.toISOString().slice(0, 16);
  }

  private toISO(value?: string | null): string {
    return value ? new Date(value).toISOString() : new Date().toISOString();
  }

  private createReview(review?: any): FormGroup {
    return this.fb.group({
      rating: [review?.rating ?? 0, [Validators.min(0), Validators.max(5)]],
      comment: [review?.comment ?? ''],
      date: [this.toDateTimeLocal(review?.date ?? new Date().toISOString())],
      reviewerName: [review?.reviewerName ?? ''],
      reviewerEmail: [review?.reviewerEmail ?? '', [Validators.email]],
    });
  }

  addReview() {
    this.reviewsArray.push(this.createReview());
  }

  addTag(value: string = '') {
    this.tagsArray.push(this.fb.control(value, Validators.required));
  }

  removeReview(index: number) {
    this.reviewsArray.removeAt(index);
  }

  removeTag(index: number) {
    this.tagsArray.removeAt(index);
  }

  get reviewsArray(): FormArray {
    return this.form.get('reviews') as FormArray;
  }

  get tagsArray(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  @Input() set product(value: Product | null) {
    this._product.set(value);
    this.isEdit.set(!!value);

    if (value) {
      // this.form.patchValue(value);
      this.form.patchValue({
        ...value,
        meta: {
          ...value.meta,
          createdAt: this.toDateTimeLocal(value.meta?.createdAt),
          updatedAt: this.toDateTimeLocal(value.meta?.updatedAt),
        },
      });

      this.reviewsArray.clear();

      value.reviews?.forEach((review) => {
        this.reviewsArray.push(this.createReview(review));
      });

      this.tagsArray.clear();

      value.tags?.forEach((tag) => {
        this.addTag(tag);
      });
    }
  }

  starWidth = computed(() => {
    const rating = this._product()?.rating ?? 0;
    return (Math.min(Math.max(rating, 0), 5) / 5) * 100; // 0-100%
  });

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
    tags: this.fb.array([]),
    images: [[]],
    dimensions: this.fb.group({
      width: [0],
      height: [0],
      depth: [0],
    }),
    reviews: this.fb.array([]),
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

    const convertedReviews = this.form.value.reviews.map((review: any) => ({
      ...review,
      date: this.toISO(review.date),
    }));

    const updatedProduct: Product = this.isEdit()
      ? {
          ...this._product()!,
          ...this.form.value,
          reviews: convertedReviews,
          meta: {
            ...this._product()!.meta,
            ...this.form.value.meta,
            createdAt: this.toISO(this.form.value.meta?.createdAt),
            updatedAt: this.toISO(this.form.value.meta?.updatedAt),
          },
          updated_at: new Date().toISOString(),
        }
      : {
          ...this.form.value,
          reviews: convertedReviews,
          meta: {
            ...this.form.value.meta,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

    this.save.emit(updatedProduct);
  }
}
