import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NzButtonComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  // public props
  @Input() cardTitle: string;
  @Input() customHeader: boolean;
  @Input() buttonText?: string;
  @Output() onBtnClickEvt? = new EventEmitter<string>();

  onBtnClick = () => {
    this.onBtnClickEvt.emit();
  };
}
