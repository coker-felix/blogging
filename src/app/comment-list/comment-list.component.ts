import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { SyncStatusComponent } from '../sync-status/sync-status.component';
import { Comment } from '../types/post.interface';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, SyncStatusComponent],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Input() loading: boolean = false;
  @Input() searchTerm: string = '';
  @Input() postId?: number;

  formatDate(date: string): string {
    return formatDistanceToNow(new Date(date)) + ' ago';
  }

  get filteredComments(): Comment[] {
    if (!this.comments) return [];

    let filtered = this.comments;

    // Filter by postId if provided
    if (this.postId) {
      filtered = filtered.filter(comment => comment.postId === this.postId);
    }

    // Filter by search term if provided
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(comment =>
        comment.body.toLowerCase().includes(searchLower) ||
        comment.email.toLowerCase().includes(searchLower) ||
        comment.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }
}