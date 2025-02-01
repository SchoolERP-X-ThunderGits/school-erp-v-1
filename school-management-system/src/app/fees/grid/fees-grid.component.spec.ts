import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesGridComponent } from './fees-grid.component';

describe('FeesGridComponent', () => {
  let component: FeesGridComponent;
  let fixture: ComponentFixture<FeesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
