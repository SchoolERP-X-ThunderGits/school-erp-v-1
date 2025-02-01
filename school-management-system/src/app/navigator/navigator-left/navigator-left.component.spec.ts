import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatorLeftComponent } from './navigator-left.component';

describe('NavigatorLeftComponent', () => {
  let component: NavigatorLeftComponent;
  let fixture: ComponentFixture<NavigatorLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigatorLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigatorLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
