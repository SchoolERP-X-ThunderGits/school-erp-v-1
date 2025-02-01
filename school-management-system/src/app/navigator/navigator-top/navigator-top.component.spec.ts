import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatorTopComponent } from './navigator-top.component';

describe('NavigatorTopComponent', () => {
  let component: NavigatorTopComponent;
  let fixture: ComponentFixture<NavigatorTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigatorTopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigatorTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
