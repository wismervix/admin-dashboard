import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheSidebar } from './the-sidebar';

describe('TheSidebar', () => {
  let component: TheSidebar;
  let fixture: ComponentFixture<TheSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
