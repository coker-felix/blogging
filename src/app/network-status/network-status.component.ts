import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wifi, WifiOff } from 'lucide-angular';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
CommonModule

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [ CommonModule, LucideAngularModule],
  templateUrl: './network-status.component.html',
  styleUrl: './network-status.component.css'
})
export class NetworkStatusComponent {
  isOnline: boolean = false;
  readonly Wifi = Wifi;
  readonly WifiOff = WifiOff;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => this.updateNetworkStatus());
      window.addEventListener('offline', () => this.updateNetworkStatus());
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateNetworkStatus();
    }
  }

  private updateNetworkStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;
    }
  }

}
