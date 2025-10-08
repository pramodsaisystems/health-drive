import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'acc-info-comm',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './acc-info-comm.component.html'
})
export class AccInfoCommTableComponent {
  @Input() data = [];
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}
}
