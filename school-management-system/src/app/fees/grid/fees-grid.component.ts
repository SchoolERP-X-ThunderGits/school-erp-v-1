import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SenderService } from '../../shared/sender.service';
import { MsgBoxService } from '../../services/msg-box.service';
import { LoaderService } from '../../shared/loader.service';
import { NotificationService } from '../../notification/notification.service';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { ReusableGridModule } from '../../common/reusable-grid/reusable-grid.module';

@Component({
  selector: 'app-fees-grid',
  imports: [
    CommonModule,
    ReusableGridModule,
  ],
  templateUrl: './fees-grid.component.html',
  styleUrl: './fees-grid.component.scss'
})
export class FeesGridComponent {
  constructor(
    private service_sender: SenderService,
    private service_msg: MsgBoxService,
    private service_loader: LoaderService,
    private notification_service: NotificationService,
  ) {

  }
  ngOnInit(): void {
    this.getAllfeestr()
  }

  @Output() toolbarOperation = new EventEmitter()
  @Input('data_to_add') set dataToAdd({ dataItem }: any) {
    if (dataItem) {
      this.datasource_fees.push(dataItem)
    }
  }
  @Input('data_to_update') set data_to_update({ dataItem }: any) {
    if (dataItem) {
      this.datasource_fees = this.datasource_fees.map(item => {
        if (item._id == dataItem._id) {
          item = dataItem
        }
        return item;
      })
    }
  }

  datasource_fees: any[] = [];

  getAllfeestr() {

    let formUrl = environment.baseUrl + '/fee/feestructure/getAll';

    this.service_loader.loadingStart("feeTypeAccordion","Please wait.")
    this.service_sender.makeGetSeverCall(formUrl, {}).subscribe({
      next: (response: any) => {
        this.service_loader.loadingStop("feeTypeAccordion")
        this.datasource_fees = response;
      },
      error: (error) => {
        this.service_loader.loadingStop("feeTypeAccordion")
      }
    })
  }

  onEdit(item: any) {
    this.toolbarOperation.emit({ action_type: 'update', data: item })
  }

  onDelete(item: any) {
    this.service_msg.confirm('Delete', 'Selected item will lost permanently. Do you want to continue?', [
      { label: 'Delete', style: 'danger', value: 'delete' },
      { label: 'Cancel', style: 'secondary', value: 'cancel' },
    ])
      .then((text) => {

        if (text == "delete") {
          this.delete_inner(item)
        }
      });
  }
  delete_inner(item: any) {
    let formUrl = environment.baseUrl + `/class/delete/${item._id}`;
    this.service_loader.loadingStart("feeTypeAccordion", "Please wait.")

    this.service_sender.makeDeleteSeverCall(formUrl, {}).subscribe({
      next: (response: any) => {
        this.service_loader.loadingStop("feeTypeAccordion")
        this.notification_service.notifier('success', "Class deleted successfully.");
        this.datasource_fees = this.datasource_fees.filter(val => val._id != item._id)
      },
      error: (error) => {
        this.service_loader.loadingStop("feeTypeAccordion")
      }
    })
  }

}