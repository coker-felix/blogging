import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sync-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusClass()">
      {{ status }}
    </div>
  `,
  styles: []
})
export class SyncStatusComponent {
  @Input() status: string = '';
  

  getStatusClass(): string {
    switch (this.status.toLowerCase()) {
      case 'synced':
        return 'capitalize bg-green-100 text-green-700';
      case 'syncing':
        return 'capitalize bg-yellow-100 text-yellow-700';
      case 'error':
        return 'capitalize bg-red-100 text-red-700';
      default:
        return 'capitalize bg-gray-100 text-gray-700';
    }
  }
}