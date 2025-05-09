import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../services/posts.service';
import { Post } from '../types/post.interface';
import { formatDistanceToNow } from 'date-fns';
import { SyncStatusComponent } from '../sync-status/sync-status.component'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, SyncStatusComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Input() selectedPostId?: number;
  @Output() onSelectPost = new EventEmitter<Post>();

  posts: Post[] = [];
  loading: boolean = true;
  formatDistanceToNow = formatDistanceToNow;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.loadPosts();
  }

  ngOnChanges() {
    this.loadPosts();
  }

  get filteredPosts(): Post[] {
    if (!this.searchTerm) return this.posts;

    const searchLower = this.searchTerm.toLowerCase();
    return this.posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.body.toLowerCase().includes(searchLower)
    );
  }

  private loadPosts() {
    this.loading = true;
    this.postsService.getPosts(this.searchTerm).subscribe({
      next: (allPosts) => {
        this.posts = allPosts;
      },
      error: (error) => {
        console.error("Failed to load posts:", error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    return formatDistanceToNow(new Date(date)) + ' ago';
  }

}