import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzButtonComponent } from 'ng-zorro-antd/button';
@Component({
  selector: 'privacy-policy-modal',
  standalone: true,
  imports: [NzModalModule, NzButtonComponent],
  templateUrl: './policy.component.html'
})
export class PrivacyPolicyModalComponent {
  @Input() isVisible = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();

  ngOnChanges() {}

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }

  handleOk() {
    this.closeModalEvent.emit(true);
  }
}
