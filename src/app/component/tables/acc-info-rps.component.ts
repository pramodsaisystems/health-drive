import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'acc-info-rps',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './acc-info-rps.component.html'
})
export class AccInfoRPSTableComponent {
  @Input() data = [];
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}
}
