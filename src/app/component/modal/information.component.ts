import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'information-modal',
  standalone: true,
  imports: [NzModalModule, NzGridModule, NzButtonModule, CommonModule],
  templateUrl: './information.component.html'
})
export class InformationModalComponent {
  constructor() {}
  @Input() isVisible = false;
  @Input() type = 'Users';

  @Output() closeModalEvent = new EventEmitter<boolean>();

  ngOnChanges() {}
  handleOk(): void {
    this.closeModalEvent.emit(false);
  }

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }
}
