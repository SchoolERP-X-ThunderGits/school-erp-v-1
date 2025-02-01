import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesGridComponent } from './classes-grid.component';

describe('ClassesGridComponent', () => {
  let component: ClassesGridComponent;
  let fixture: ComponentFixture<ClassesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
