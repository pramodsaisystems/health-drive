import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Role {
  clientid: number;
  clientname: string;
  currentUserId: number;
  isactive: boolean;
  isshowntoddl: boolean;
  rolename: string;
  userroleid: number;
}

@Component({
  selector: 'ref-files-view1',
  standalone: true,
  imports: [NzTableModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ref-files-view1.component.html'
})
export class RefFilesView1Component {
  @Input() fileListData = [];
  @Input() validateForm!: FormGroup;
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;
}
