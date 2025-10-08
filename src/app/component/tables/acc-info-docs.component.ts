import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'acc-info-docs',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './acc-info-docs.component.html'
})
export class AccInfoDocsTableComponent {
  @Input() data = [];
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}
}
