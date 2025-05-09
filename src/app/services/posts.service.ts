import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post, Comment } from '../types/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  getPosts(searchTerm: string): Observable<Post[]> {
    const samplePosts: Post[] = [
      {
        id: 1,
        userId: 1,
        title: "Getting Started with Angular",
        body: "Learn the basics of Angular and how to build your first application...",
        userName: "John Doe",
        createdAt: new Date().toISOString(),
        syncStatus: "synced"
      },
      {
        id: 2,
        userId: 2,
        title: "Advanced TypeScript Patterns",
        body: "Explore advanced TypeScript patterns and best practices for better code...",
        userName: "Jane Smith",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        syncStatus: "syncing"
      },
      {
        id: 3,
        userId: 1,
        title: "Building Responsive UIs",
        body: "A comprehensive guide to creating responsive user interfaces...",
        userName: "Mike Johnson",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        syncStatus: "error"
      }
    ];

    if (searchTerm) {
      return of(samplePosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }

    return of(samplePosts);
  }

  getComments(postId: number): Observable<Comment[]> {
    const sampleComments: Comment[] = [
      {
        id: 1,
        postId: postId,
        name: "Alice Johnson",
        email: "alice@example.com",
        body: "Great article! This really helped me understand the concepts better.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        postId: postId,
        name: "Bob Smith",
        email: "bob@example.com",
        body: "I have a question about the implementation. Could you clarify...",
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        postId: postId,
        name: "Carol White",
        email: "carol@example.com",
        body: "Thanks for sharing this knowledge!",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    return of(sampleComments);
  }

  deletePost(postId: number): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        console.log(`Post ${postId} deleted successfully`);
        observer.next();
        observer.complete();
      }, 500);
    });
  }
}