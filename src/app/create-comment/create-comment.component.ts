import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../types/post.interface';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent {
  @Input() postId!: number; 
  @Output() commentAdded = new EventEmitter<Comment>();

  commentForm: FormGroup;
  submitting: boolean = false;
  error: string = '';
  isOnline: boolean = navigator.onLine;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      body: ['', [Validators.required]]
    });
  }

  handleSubmit(): void {
    if (this.commentForm.invalid) return;

    this.submitting = true;
    this.error = '';

    try {
      const newComment: Comment = {
        id: Date.now(),
        postId: this.postId,
        name: this.commentForm.value.name,
        email: this.commentForm.value.email,
        body: this.commentForm.value.body,
        createdAt: new Date().toISOString()
      };
  
      this.commentAdded.emit(newComment);
      this.commentForm.reset();
    } catch (err) {
      console.error('Failed to add comment:', err);
      this.error = 'Failed to add comment. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}