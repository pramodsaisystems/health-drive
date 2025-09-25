import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  // Create a BehaviorSubject to hold the current data state (default value: null)
  private dataSource = new BehaviorSubject<any | null>(null);
  private dashboardService = new BehaviorSubject<string | null>(null);
  private regTFAService = new BehaviorSubject<string | null>(null);
  private idleService = new BehaviorSubject<string | null>(null);
  private updateClients = new BehaviorSubject<string | null>(null);

  // Expose the data as an observable
  currentData$ = this.dataSource.asObservable();
  dashService = this.dashboardService.asObservable();
  regTFAService$ = this.regTFAService.asObservable();
  idleService$ = this.idleService.asObservable();
  updateClients$ = this.updateClients.asObservable();

  // Function to update the current data
  updateData(newData: any) {
    this.dataSource.next(newData);
  }

  clearData(): void {
    this.dataSource.next(null); // or use the initial value if it's not null
  }

  updateDashData(newData: string) {
    this.dashboardService.next(newData);
  }

  clearDashData(): void {
    this.dashboardService.next(null); // or use the initial value if it's not null
  }

  updateRegTFAD(newData: string) {
    this.regTFAService.next(newData);
  }

  clearRegTFA(): void {
    this.regTFAService.next(null); // or use the initial value if it's not null
  }

  updateIdleService(newData: string) {
    this.idleService.next(newData);
  }

  clearIdleService(): void {
    this.idleService.next(null); // or use the initial value if it's not null
  }

  
  updateClientService(newData: string) {
    this.updateClients.next(newData);
  }

  clearClientService(): void {
    this.updateClients.next(null); // or use the initial value if it's not null
  }
}
