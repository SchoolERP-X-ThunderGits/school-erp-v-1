import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCurdComponent } from './fees-curd.component';

describe('FeesCurdComponent', () => {
  let component: FeesCurdComponent;
  let fixture: ComponentFixture<FeesCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesCurdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
