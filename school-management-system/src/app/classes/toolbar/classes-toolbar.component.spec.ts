import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesToolbarComponent } from './classes-toolbar.component';

describe('ClassesToolbarComponent', () => {
  let component: ClassesToolbarComponent;
  let fixture: ComponentFixture<ClassesToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
