import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.checkForUpdates();
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates every 6 hours
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);

      // Handling update available
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm('A new version is available. Load it?')) {
            window.location.reload();
          }
        });

      // Optional: Log update failures
      this.swUpdate.unrecoverable.subscribe(event => {
        console.error('SW Update Error:', event.reason);
        alert('An error occurred. Please reload the page.');
      });
    }
  }
} 