import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SenderService } from '../../shared/sender.service';
import { NotificationService } from '../../notification/notification.service';
import { LoaderService } from '../../shared/loader.service';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-fees-curd',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fees-curd.component.html',
  styleUrl: './fees-curd.component.scss'
})
export class FeesCurdComponent implements OnInit {
  @Output() toolbarOperation = new EventEmitter();

  heaeder_name!: string;
  callsource!: string;
  button!: string;
  selectedDataItem: any = null;
  feeForm: FormGroup;
  classOptions: any[] = [];
  feeTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service_sender: SenderService,
    private notification_service: NotificationService,
    private service_loader: LoaderService
  ) {
    this.feeForm = this.fb.group({
      name: ['', [Validators.required]],
      class: ['', Validators.required],
      feeGroups: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getAllClasses()
    this.getAllfeeType()
  }

  getAllClasses() {

    let formUrl = environment.baseUrl + '/class/getAll';

    this.service_loader.loadingStart("classCurd", "Please wait.")
    this.service_sender.makeGetSeverCall(formUrl, {}).subscribe({
      next: (response: any) => {
        this.service_loader.loadingStop("classCurd")
        this.classOptions = response;
      },
      error: (error) => {
        this.service_loader.loadingStop("classCurd")
      }
    })
  }
  getAllfeeType() {

    let formUrl = environment.baseUrl + '/fee/feetypes/getAll';

    this.service_loader.loadingStart("classCurd", "Please wait.")
    this.service_sender.makeGetSeverCall(formUrl, {}).subscribe({
      next: (response: any) => {
        this.service_loader.loadingStop("classCurd")
        this.feeTypes = response;
      },
      error: (error) => {
        this.service_loader.loadingStop("classCurd")
      }
    })
  }

  get feeGroups(): FormArray {
    return this.feeForm.get('feeGroups') as FormArray;
  }

  get name() {
    return this.feeForm.get('name');
  }

  get classField() {
    return this.feeForm.get('class');
  }


  addFeeGroup() {
    const feeGroup = this.fb.group({
      feeType: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required]
    });
    this.feeGroups.push(feeGroup);
  }


  removeFeeGroup(index: number) {
    this.feeGroups.removeAt(index);
  }

  @Input('child_data') set child_data({ callsource, dataItem }: any) {
    this.callsource = callsource;
    if (callsource == 'create') {
      this.heaeder_name = 'Add Fee Structure';
      this.button = 'Create';
    } else {
      this.selectedDataItem = dataItem;
      this.heaeder_name = 'Edit Fee Structure';
      this.button = 'Update';
      this.bind_form(dataItem);
    }
  }

  bind_form(dataItem: any) {
    if (dataItem) {
      this.feeForm.patchValue({
        name: dataItem.name,
        class: dataItem.class,
      });

      if (dataItem.feeGroups && dataItem.feeGroups.length) {
        const feeGroupsArray = dataItem.feeGroups.map((group: any) =>
          this.fb.group({
            feeType: [group.feeType, Validators.required],
            amount: [group.amount, [Validators.required, Validators.min(1)]],
            date: [group.date, Validators.required],
          })
        );
        const feeGroupsFormArray = this.fb.array(feeGroupsArray);
        this.feeForm.setControl('feeGroups', feeGroupsFormArray);
      }
    }
  }

  submitForm() {

    const formData = this.feeForm.value;
    if (!this.feeForm.valid) {
      this.notification_service.notifier('error', 'Please fill all the required field.');
      return;
    }



    if (this.callsource === 'create') {
      this.create(formData)
    } else {
      this.edit(formData)
    }
  }
  create(formData: any) {

    let formUrl = environment.baseUrl + '/fee/feestructure/add';
    this.service_loader.loadingStart('classCurd', 'Please wait');
    this.service_sender.makePostSeverCall(formUrl, formData).subscribe({

      next: (response: any) => {
        this.service_loader.loadingStop('classCurd');
        this.notification_service.notifier('success', 'Fee structure created successfully!');
        this.toolbarOperation.emit({ action_type: 'created', data: response })
      },
      error: (error) => {
        this.service_loader.loadingStop('classCurd');
        this.notification_service.notifier('error', 'Error while creating fee structure.');
      }
    })

  }
  edit(formData: any) {

    let formUrl = environment.baseUrl + '/fee/feestructure/add';
    this.service_loader.loadingStart('classCurd', 'Please wait');
    this.service_sender.makePostSeverCall(formUrl, formData).subscribe({

      next: (response: any) => {
        this.service_loader.loadingStop('classCurd');
        this.notification_service.notifier('success', 'Fee structure updated successfully!');
        this.toolbarOperation.emit({ action_type: 'updated', data: response })
      },
      error: (error) => {
        this.service_loader.loadingStop('classCurd');
        this.notification_service.notifier('error', 'Error while creating fee structure.');
      }
    })
  }

  close() {
    this.toolbarOperation.emit({ action_type: 'close', data: null });
  }

  // Helper method for error messages
  getErrorMessage(field: string, index?: number): string {
    const control =
      index !== undefined ? this.feeGroups.at(index).get(field) : this.feeForm.get(field);

    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minLength')) {
      return 'Minimum 3 characters required';
    }
    if (control?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    return '';
  }
}
