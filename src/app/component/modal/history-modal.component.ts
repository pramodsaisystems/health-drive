import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
@Component({
  selector: 'history-modal',
  standalone: true,
  imports: [NzModalModule, NzGridModule, NzButtonModule, CommonModule, NzTableModule],
  templateUrl: './history-modal.component.html'
})
export class HistoryModalComponent {
  constructor() {}
  @Input() isVisible = false;
  @Input() historyData = [];

  @Output() closeModalEvent = new EventEmitter<boolean>();

  ngOnChanges() {}
  handleOk(): void {
    this.closeModalEvent.emit(false);
  }

  handleCancel(): void {
    this.closeModalEvent.emit(false);
  }
}
