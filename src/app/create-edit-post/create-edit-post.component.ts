import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../types/post.interface';
import { LucideAngularModule,ArrowLeft } from 'lucide-angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-create-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './create-edit-post.component.html',
  styleUrls: ['./create-edit-post.component.css']
})
export class CreateEditPostComponent {
  @Input() post?: Post;
  @Output() onBack = new EventEmitter<void>();
  @Output() onPostSaved = new EventEmitter<Post>();

  postForm: FormGroup;
  title: string = this.post?.title || '';
  body: string = this.post?.body || '';
  userName: string = this.post?.userName || '';
  submitting: boolean = false;
  error: string = '';
  isOnline: boolean = navigator.onLine;
  readonly ArrowLeft = ArrowLeft;

  constructor(private fb: FormBuilder,
    private postsService: PostsService) {
    window.addEventListener('online', () => this.updateNetworkStatus());
    window.addEventListener('offline', () => this.updateNetworkStatus());
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      userName: ['', [Validators.required]]
    });
  }

  private updateNetworkStatus(): void {
    this.isOnline = navigator.onLine;
  }

  ngOnInit() {
    if (this.post) {
      this.postForm.patchValue({
        title: this.post.title,
        body: this.post.body
      });
    }
  }

  handleSubmit(): void {
    if (this.postForm.invalid) return;
  
    this.submitting = true;
    this.error = '';
  
    try {
      const formData = this.postForm.value;
      const postData = {
        ...formData,
        userId: 1,
        userName: formData.userName || 'Unknown',
        syncStatus: 'pending'
      };
  
      const request = this.post 
        ? this.postsService.updatePost({ ...this.post, ...postData })
        : this.postsService.createPost(postData);
  
      request.subscribe({
        next: (savedPost) => {
          this.onPostSaved.emit(savedPost);
          this.onBack.emit();
        },
        error: (err) => {
          console.error('Failed to save post:', err);
          this.error = 'Failed to save post. Please try again.';
          this.submitting = false;
        }
      });
    } catch (err) {
      console.error('Failed to save post:', err);
      this.error = 'Failed to save post. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  get titleError(): string {
    const control = this.postForm.get('title');
    if (control?.hasError('required')) return 'Title is required';
    if (control?.hasError('minlength')) return 'Title must be at least 3 characters';
    return '';
  }

  get userNameError(): string {
    const control = this.postForm.get('userName');
    if (control?.hasError('required')) return 'userName is required';
    if (control?.hasError('minlength')) return 'userName must be at least 3 characters';
    return '';
  }

  get bodyError(): string {
    const control = this.postForm.get('body');
    if (control?.hasError('required')) return 'Content is required';
    if (control?.hasError('minlength')) return 'Content must be at least 10 characters';
    return '';
  }
}