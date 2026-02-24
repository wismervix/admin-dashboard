import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreatePage } from './product-create-page';

describe('ProductCreatePage', () => {
  let component: ProductCreatePage;
  let fixture: ComponentFixture<ProductCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
