// Angular import
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();

  getName = () => {
    let clientName = localStorage.getItem('abbr');
    let submenu = sessionStorage.getItem('dashboard');
    if (clientName && submenu) {
      return clientName + ' -> ' + submenu;
    } else if (clientName) {
      return clientName;
    } else {
      return '';
    }
  };
}
