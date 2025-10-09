import { Component, Input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { get1 } from 'src/utils/api';
import { APP_HD_URL } from 'src/utils/urls';

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
  selector: 'ref-files-view2',
  standalone: true,
  imports: [NzTableModule, ReactiveFormsModule, RouterModule, NzIconModule, NzButtonModule],
  templateUrl: './ref-files-view2.component.html'
})
export class RefFilesView2Component {
  @Input() fileListData = [];
  @Input() validateForm!: FormGroup;
  loading: boolean = false;
  constructor() {}

  ngOnChanges() {}

  sortRoleNameFn = (a: Role, b: Role): any => a.rolename.localeCompare(b.rolename);
  sortClientNameFn = (a: Role, b: Role): any => a.clientname.localeCompare(b.clientname);
  sortActiveFn = (a: Role, b: Role): any => !a.isactive && b.isactive;

  formatDate(dateString: string): string {
    return dateString ? new Date(dateString).toLocaleString() : '';
  }

  formatFileName(file_name: string): string {
    return file_name && file_name.length > 25 ? file_name.substring(0, 25) + '...' : file_name;
  }

  openPageimg = async (thisobj) => {
    const filename = thisobj?.image_file_path ? thisobj?.image_file_path.trim() : thisobj;
    const apiUrl = APP_HD_URL + 'BotQueue/GetPageImg'; // Replace with actual endpoint
    try {
      // Get page image file path
      const response = await get1(`${apiUrl}?url=${encodeURIComponent(filename)}`);
      const filePath = await response.text(); // If API returns plain text file path

      if (filePath.includes('.')) {
        const imgPath = '../' + filePath;
        const exists = await this.imageExists(imgPath);

        if (exists) {
          window.open(imgPath);
        } else {
          alert('Error unable to retrieve the file');
        }
      } else {
        alert('Error unable to retrieve the file');
      }
    } catch (error) {
      alert('Error unable to retrieve the file');
    }
  };

  // async version, returns true if file exists
  imageExists = async (image_url) => {
    if (image_url !== '../') {
      try {
        const res = await fetch(image_url, { method: 'HEAD' });
        return res.status !== 404;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  };
}
