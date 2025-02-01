import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableGridColumnComponent } from './reusable-grid-column.component';

describe('ReusableGridColumnComponent', () => {
  let component: ReusableGridColumnComponent;
  let fixture: ComponentFixture<ReusableGridColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableGridColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableGridColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
