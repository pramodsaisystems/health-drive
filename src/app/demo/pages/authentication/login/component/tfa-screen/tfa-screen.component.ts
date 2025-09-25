import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzInputDirective, NzInputModule } from 'ng-zorro-antd/input';
@Component({
  selector: 'tfa-screen',
  standalone: true,
  imports: [
    NzFormModule,
    NzButtonComponent,
    CommonModule,
    NgxOtpInputComponent,
    NzButtonComponent,

    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputDirective,
    NzInputModule
  ],
  templateUrl: './tfa-screen.component.html',
  styleUrls: ['../../login.component.scss']
})
export class TFAScreenComponent {
  @Input() email = '';
  @Output() closeModalEvent = new EventEmitter<boolean>();
  otpOptions: NgxOtpInputComponentOptions = { otpLength: 6 };

  constructor(private message: NzMessageService) {}

  ngOnInit() {}
}
