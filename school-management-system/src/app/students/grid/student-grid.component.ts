import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReusableGridModule } from '../../common/reusable-grid/reusable-grid.module';
import { environment } from '../../../environment/environment';
import { SenderService } from '../../shared/sender.service';
import { LoaderService } from '../../shared/loader.service';

@Component({
  selector: 'app-student-grid',
  imports: [
    CommonModule,
    ReusableGridModule,
  ],
  templateUrl: './student-grid.component.html',
  styleUrl: './student-grid.component.scss'
})
export class StudentGridComponent implements OnInit {
  constructor(
    private service_sender: SenderService,
    private service_loader: LoaderService,
  ) {

  }
  ngOnInit(): void {
    this.getStudents()
  }


  datasource_student = []
  getStudents() {

    let formUrl = environment.baseUrl + '/student/getStudents';

    this.service_loader.loadingStart("student_grid","Please wait.")
    this.service_sender.makeGetSeverCall(formUrl, {}).subscribe({
      next: (response: any) => {
        this.service_loader.loadingStop("student_grid")
        this.datasource_student = response
      },
      error: (error) => {
        this.service_loader.loadingStop("student_grid")
      }
    })
  }
}
