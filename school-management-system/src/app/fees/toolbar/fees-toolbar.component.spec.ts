import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesToolbarComponent } from './fees-toolbar.component';

describe('FeesToolbarComponent', () => {
  let component: FeesToolbarComponent;
  let fixture: ComponentFixture<FeesToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
