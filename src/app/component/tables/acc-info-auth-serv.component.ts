import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'acc-info-auth-serv',
  standalone: true,
  imports: [NzTableModule],
  templateUrl: './acc-info-auth-serv.component.html'
})
export class AccInfoAuthServableComponent {
  @Input() data = [];
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}
}
