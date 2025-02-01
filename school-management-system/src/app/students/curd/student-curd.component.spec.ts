import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCurdComponent } from './student-curd.component';

describe('StudentCurdComponent', () => {
  let component: StudentCurdComponent;
  let fixture: ComponentFixture<StudentCurdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCurdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
