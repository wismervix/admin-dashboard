import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheHeader } from './the-header';

describe('TheHeader', () => {
  let component: TheHeader;
  let fixture: ComponentFixture<TheHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
