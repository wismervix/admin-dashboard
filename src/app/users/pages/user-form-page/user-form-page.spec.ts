import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormPage } from './user-form-page';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let fixture: ComponentFixture<UserFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
