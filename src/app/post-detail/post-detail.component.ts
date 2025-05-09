import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, Comment } from '../types/post.interface';
import { PostsService } from '../services/posts.service';
import { formatDistanceToNow } from 'date-fns';
import { SyncStatusComponent } from '../sync-status/sync-status.component';
import { LucideAngularModule,ArrowLeft, Edit, Trash  } from 'lucide-angular';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, SyncStatusComponent, LucideAngularModule, CommentListComponent, SearchComponent, CreateCommentComponent],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  @Input() post!: Post | undefined;
  @Output() onBack = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Post>();

  comments: Comment[] = [];
  commentSearchTerm: string = '';
  loading: boolean = true;
  showCommentForm: boolean = false;
  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash = Trash;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.loading = true;
    if (!this.post) return;
    this.postsService.getComments(this.post.id).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (error) => {
        console.error("Failed to load comments:", error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  handleCommentAdded(newComment: Comment): void {
    this.comments = [newComment, ...this.comments];
    this.showCommentForm = false;
  }

  formatDate(date: string | undefined): string {
    if (date == undefined) return "";
    return formatDistanceToNow(new Date(date)) + ' ago';
  }

  setCommentSearchTerm(term: string): void {
    this.commentSearchTerm = term;
  }

  get filteredComments(): Comment[] {
    if (!this.commentSearchTerm) return this.comments;
    
    const searchLower = this.commentSearchTerm.toLowerCase();
    return this.comments.filter(comment =>
      comment.body.toLowerCase().includes(searchLower) ||
      comment.name.toLowerCase().includes(searchLower) || 
      comment.email.toLowerCase().includes(searchLower)
    );
  }

}