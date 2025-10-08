import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { post } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'acc-info-insu-table',
  templateUrl: './acc-info-insu-table.component.html'
})
export class TFAModalComponent {
  @Input() data = [];

  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {}

  ngOnChanges() {}
}
