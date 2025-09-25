import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  async getDeviceId(): Promise<string> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId; // Unique device identifier
  }
}
