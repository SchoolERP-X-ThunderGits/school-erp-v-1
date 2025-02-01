import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesCurdComponent } from './classes-curd.component';

describe('ClassesCurdComponent', () => {
  let component: ClassesCurdComponent;
  let fixture: ComponentFixture<ClassesCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesCurdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
