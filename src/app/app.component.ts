import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NetworkStatusComponent } from "./network-status/network-status.component";
import { Post } from './types/post.interface';
import { PostsComponent } from './posts/posts.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { CreateEditPostComponent } from './create-edit-post/create-edit-post.component';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NetworkStatusComponent,
    NetworkStatusComponent,
    PostsComponent,
    PostDetailComponent,
    CreateEditPostComponent,
    SearchComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  searchTerm: string = '';
  selectedPostId?: number;
  // selectedPost?: Post;
  selectedPost: Post | null = null;
  isCreating: boolean = false;
  isEditing: boolean = false;

  handleCreateNew(): void {
    this.isCreating = true;
    this.selectedPost = null;
  }

  setSearchTerm(term: string): void {
    this.searchTerm = term;
  }

  handlePostSelect(post: Post): void {
    this.selectedPost = post;
    this.selectedPostId = post.id;

  }

  handleBack(): void {
    this.selectedPost = null;
    this.selectedPostId = undefined;
    this.isCreating = false;
    this.isEditing = false;
  }

  handleEdit(post: Post): void {
    this.isEditing = true;
    this.selectedPost = post;
  }
}
