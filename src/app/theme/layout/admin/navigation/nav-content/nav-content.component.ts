// Angular import
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { NavigationItem } from '../navigation';
import { environment } from 'src/environments/environment';
import { get } from 'src/utils/api';
import { APP_API_URL } from 'src/utils/urls';
import { DataSharingService } from 'src/utils/broadcast-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/activity.service';
@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<any> = new EventEmitter();
  @Input() navCollapsed = false;
  // version
  currentApplicationVersion = environment.appVersion;
  navigation: any;
  windowWidth = window.innerWidth;
  subscription: Subscription;

  // Constructor
  constructor(
    public nav: NavigationItem,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private dataSharingService: DataSharingService,
    private router: Router,
    private sharedService: SharedService
  ) {
    // this.navigation = this.nav.get();
    // this.getNavItems();
  }

  // Life cycle events
  ngOnInit() {
    // this.getNavItems();
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
    // this.subscription = this.dataSharingService.currentData$.subscribe((data) => {
    //   if (data?.id) {
    //     this.getNavItems(data?.id, data?.refresh, data?.init);
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.subscription) {
      // this.subscription.unsubscribe();
      // this.dataSharingService.clearData();
      // this.dataSharingService.clearRegTFA();
      // this.dataSharingService.clearDashData();
    }
  }

  ngOnChange() {
    console.log(this.navCollapsed);
  }

  // getReportId = (url) => {
  //   if (url) {
  //     let urlParams = new URLSearchParams(url?.split('?')[1]);
  //     return urlParams?.get('reportId') ? '/dashboard/' + urlParams?.get('reportId') + '/' + localStorage.getItem('abbr') : url;
  //   } else {
  //     return url;
  //   }
  // };

  // menuOpen = (lastMenu, ind, menuname, index1?) => {
  //   if (lastMenu) {
  //     return lastMenu === menuname.toLowerCase();
  //   } else if (index1) {
  //     return ind === index1 ? true : false;
  //   } else {
  //     return ind === 0 ? true : false;
  //   }
  // };

  // subMenuOpen = (lastSubMenu, ind, ind1, submenuname, index1?, index2?) => {
  //   if (lastSubMenu) {
  //     return lastSubMenu === submenuname;
  //   } else if (index1 && index2) {
  //     return ind === index1 && ind1 === index2 ? true : false;
  //   } else {
  //     return ind === 0 && ind1 === 0 ? true : false;
  //   }
  // };

  // getCategoryMenuRes = (data) => {
  //   let updatedData = data.map((i) => {
  //     if (i.subMenuList.length > 0) {
  //       let cl = [];
  //       let op = [];
  //       let reg = [];
  //       i.subMenuList.map((x) => {
  //         if (x.isClinical || x.isOperational) {
  //           if (x.isClinical && !x.isOperational) {
  //             cl.push(x);
  //           }
  //           if (x.isOperational) {
  //             op.push(x);
  //           }
  //         } else {
  //           reg.push(x);
  //         }
  //       });
  //       i.subMenuList = [...cl, ...op, ...reg];
  //     }
  //     return i;
  //   });

  //   return updatedData;
  // };

  // getNavItems = async (Id?: any, refresh?: boolean, init?: boolean) => {
  //   if (Id) {
  //     let clientId = Id ? Id : localStorage.getItem('clientId');
  //     let currentUserId = localStorage.getItem('currentUserId');
  //     let res: any = await get(APP_API_URL + 'Menus/GetUserMenus/' + currentUserId + '?clientId=' + clientId);
  //     if (res.data.length > 0) {
  //       res.data = this.getCategoryMenuRes(res.data);
  //     }
  //     if (res?.status === 200) {
  //       let lastMenu = null;
  //       let lastSubMenu = null;
  //       if (!init && init !== undefined) {
  //         lastMenu = localStorage.getItem('menutype') ? localStorage.getItem('menutype') : null;
  //         lastSubMenu = sessionStorage.getItem('dashboard') ? sessionStorage.getItem('dashboard') : null;
  //       }
  //       if (refresh) {
  //         let index1 = -1;
  //         let index2 = -1;
  //         this.navigation.map((i, ind) => {
  //           if (i.isopen) {
  //             index1 = ind;
  //             i.children.map((j, ind1) => {
  //               if (j.title.toLowerCase() === 'clients') {
  //                 index2 = ind1;
  //               }
  //             });
  //           }
  //         });

  //         this.navigation = await res?.data?.map((i, ind) => {
  //           return {
  //             id: i?.menuid,
  //             title: i?.menuname,
  //             type: 'group',
  //             icon: i?.menuicon,
  //             url: i?.url ? this.getReportId(i?.url) : i?.path,
  //             embedurl: i?.url,
  //             isopen: this.menuOpen(lastMenu, ind, i?.menuname, index1),
  //             clopen: true,
  //             opopen: true,
  //             children:
  //               i?.subMenuList?.length > 0
  //                 ? i?.subMenuList?.map((x, ind1) => {
  //                     return {
  //                       id: x?.submenuid,
  //                       title: x?.submenuname,
  //                       type: 'item',
  //                       classes: 'nav-item',
  //                       url: x?.url ? this.getReportId(x?.url) : x?.path,
  //                       icon: x?.menuicon,
  //                       breadcrumbs: false,
  //                       embedurl: x?.url,
  //                       selected: this.subMenuOpen(lastSubMenu, ind, ind1, x.submenuname, index1, index2),
  //                       category: x?.category,
  //                       isClinical: x?.isClinical,
  //                       isOperational: x?.isOperational
  //                     };
  //                   })
  //                 : []
  //           };
  //         });
  //         localStorage.setItem('menudata', JSON.stringify(this.navigation));
  //         this.dataSharingService.updateDashData(this.navigation);
  //       } else {
  //         this.navigation = await res?.data?.map((i, ind) => {
  //           return {
  //             id: i?.menuid,
  //             title: i?.menuname,
  //             type: 'group',
  //             icon: i?.menuicon,
  //             url: i?.url ? this.getReportId(i?.url) : i?.path,
  //             embedurl: i?.url,
  //             isopen: this.menuOpen(lastMenu, ind, i?.menuname),
  //             clopen: true,
  //             opopen: true,
  //             children:
  //               i?.subMenuList?.length > 0
  //                 ? i?.subMenuList?.map((x, ind1) => {
  //                     return {
  //                       id: x?.submenuid,
  //                       title: x?.submenuname,
  //                       type: 'item',
  //                       classes: 'nav-item',
  //                       url: x?.url ? this.getReportId(x?.url) : x?.path,
  //                       icon: x?.menuicon,
  //                       breadcrumbs: false,
  //                       embedurl: x?.url,
  //                       selected: this.subMenuOpen(lastSubMenu, ind, ind1, x.submenuname),
  //                       category: x?.category,
  //                       isClinical: x?.isClinical,
  //                       isOperational: x?.isOperational
  //                     };
  //                   })
  //                 : []
  //           };
  //         });
  //         localStorage.setItem('menudata', JSON.stringify(this.navigation));
  //         this.dataSharingService.updateDashData(this.navigation);
  //         if (this.navigation[0]?.children?.length > 0) {
  //           localStorage.setItem('menutype', lastMenu ? lastMenu : this.navigation[0]?.title ? this.navigation[0].title.toLowerCase() : '');

  //           sessionStorage.setItem('dashboard', lastSubMenu ? lastSubMenu : this.navigation[0]?.children[0]?.title);
  //           const url = window.location.pathname;
  //           if (window.location.pathname === '/dashboard') {
  //             this.router.navigate([this.navigation[0].children[0].url]);
  //           } else {
  //             !refresh ? (!init && init !== undefined ? null : this.router.navigate([this.navigation[0].children[0].url])) : null;
  //           }

  //           this.sharedService.auditLog(lastMenu ? lastMenu : this.navigation[0]?.children[0]?.title);
  //         } else if (this.navigation.length > 0) {
  //           this.sharedService.auditLog(lastMenu ? lastMenu : this.navigation[0]?.title);
  //           if (window.location.pathname === '/dashboard') {
  //             this.router.navigate([this.navigation[0].url]);
  //           } else {
  //             !refresh ? (!init && init !== undefined ? null : this.router.navigate([this.navigation[0].url])) : null;
  //           }
  //           localStorage.setItem('menutype', lastMenu ? lastMenu : this.navigation[0]?.title ? this.navigation[0].title.toLowerCase() : '');
  //           sessionStorage.setItem('dashboard', lastMenu ? lastMenu : this.navigation[0]?.title);
  //         } else {
  //           this.router.navigate(['/']);
  //           localStorage.setItem('menutype', '');
  //         }
  //       }
  //     }
  //   }
  // };

  // fireOutClick() {
  //   let current_url = this.location.path();
  //   const baseHref = this.locationStrategy.getBaseHref();
  //   if (baseHref) {
  //     current_url = baseHref + this.location.path();
  //   }
  //   const link = "a.nav-link[ href='" + current_url + "' ]";
  //   const ele = document.querySelector(link);
  //   if (ele !== null && ele !== undefined) {
  //     const parent = ele.parentElement;
  //     const up_parent = parent?.parentElement?.parentElement;
  //     const last_parent = up_parent?.parentElement;
  //     if (parent?.classList.contains('coded-hasmenu')) {
  //       parent.classList.add('coded-trigger');
  //       parent.classList.add('active');
  //     } else if (up_parent?.classList.contains('coded-hasmenu')) {
  //       up_parent.classList.add('coded-trigger');
  //       up_parent.classList.add('active');
  //     } else if (last_parent?.classList.contains('coded-hasmenu')) {
  //       last_parent.classList.add('coded-trigger');
  //       last_parent.classList.add('active');
  //     }
  //   }
  // }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }

  // closeOtherMenu(event: any, item: any, menu?: any) {
  //   this.sharedService.auditLog(item?.title);
  //   localStorage.setItem('menutype', menu?.title ? menu.title.toLowerCase() : '');
  //   sessionStorage.setItem('dashboard', item?.title);
  //   const ele = event.target;
  //   if (ele !== null && ele !== undefined) {
  //     const parent = ele.parentElement;
  //     const up_parent = parent.parentElement.parentElement;
  //     const last_parent = up_parent.parentElement;
  //     const sections = document.querySelectorAll('.coded-hasmenu');
  //     for (let i = 0; i < sections.length; i++) {
  //       sections[i].classList.remove('active');
  //       sections[i].classList.remove('coded-trigger');
  //     }

  //     if (parent.classList.contains('coded-hasmenu')) {
  //       parent.classList.add('coded-trigger');
  //       parent.classList.add('active');
  //     } else if (up_parent.classList.contains('coded-hasmenu')) {
  //       up_parent.classList.add('coded-trigger');
  //       up_parent.classList.add('active');
  //     } else if (last_parent.classList.contains('coded-hasmenu')) {
  //       last_parent.classList.add('coded-trigger');
  //       last_parent.classList.add('active');
  //     }
  //   }
  //   if ((document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
  //     (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.remove('mob-open');
  //   }
  // }

  // onMenuClick = (item: any) => {
  //   this.navigation.filter((data: any) => {
  //     if (item.id !== data.id) {
  //       data.isopen = false;
  //     }
  //   });
  // };

  // checkForClinicalOrOperational = (item) => {
  //   let ind = item.findIndex((i) => {
  //     return i.isOperational || i.isClinical;
  //   });

  //   return ind > -1;
  // };

  // checkForClinical = (item) => {
  //   let ind = item.findIndex((i) => {
  //     return i.isClinical;
  //   });
  //   return ind > -1;
  // };
  // checkForOperational = (item) => {
  //   let ind = item.findIndex((i) => {
  //     return i.isOperational;
  //   });
  //   return ind > -1;
  // };

  // onCLOpenClick = (clopen, item) => {
  //   this.navigation.filter((data: any) => {
  //     if (item.id === data.id) {
  //       data.clopen = !clopen;
  //     }
  //   });
  // };

  // onOPOpenClick = (opopen, item) => {
  //   this.navigation.filter((data: any) => {
  //     if (item.id === data.id) {
  //       data.opopen = !opopen;
  //     }
  //   });
  // };
}
