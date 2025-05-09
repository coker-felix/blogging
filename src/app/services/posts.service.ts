import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Post, Comment, User } from '../types/post.interface';
import { DbService } from '../data-service.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';
  private isOnline = false;

  constructor(
    private http: HttpClient,
    private dbService: DbService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => this.handleOnlineStatus(true));
      window.addEventListener('offline', () => this.handleOnlineStatus(false));
      this.loadInitialData();
    }
  }

  private async loadInitialData() {
    try {
      if (this.isOnline) {
        const users = await this.http.get<User[]>(`${this.API_URL}/users`).toPromise();
        const posts = await this.http.get<Post[]>(`${this.API_URL}/posts`).toPromise();
        
        if (users) await this.dbService.saveUsers(users);
        if (posts) {
          const enrichedPosts = this.mergePostsWithUsers(
            posts.map(post => ({ ...post, syncStatus: 'synced' })),
            users || []
          );
          await this.dbService.savePosts(enrichedPosts);
        }
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  private handleOnlineStatus(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.syncPendingItems();
      this.loadInitialData();
    }
  }

  async syncPendingItems() {
    const { posts, comments } = await this.dbService.getPendingItems();

    posts.forEach(post => {
      const request = post.id ?
        this.http.put(`${this.API_URL}/posts/${post.id}`, post) :
        this.http.post(`${this.API_URL}/posts`, post);

      request.pipe(
        tap(async () => {
          post.syncStatus = 'synced';
          await this.dbService.savePost(post);
        }),
        catchError(async () => {
          post.syncStatus = 'failed';
          await this.dbService.savePost(post);
          return throwError(() => new Error('Sync failed'));
        })
      ).subscribe();
    });
  }

  private getUsers(): Observable<User[]> {
    if (!this.isOnline) {
      return from(this.dbService.getUsers());
    }
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      tap(users => this.dbService.saveUsers(users))
    );
  }

  private mergePostsWithUsers(posts: Post[], users: User[]): Post[] {
    return posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        userName: user?.name || 'Unknown',
        userEmail: user?.email
      };
    });
  }

  getPosts(searchTerm?: string): Observable<Post[]> {
    if (!this.isOnline) {
      return forkJoin([
        from(this.dbService.getPosts()),
        from(this.dbService.getUsers())
      ]).pipe(
        map(([posts, users]) => this.mergePostsWithUsers(posts, users)),
        map(posts => this.filterPosts(posts, searchTerm))
      );
    }

    return forkJoin([
      this.http.get<Post[]>(`${this.API_URL}/posts`),
      this.getUsers()
    ]).pipe(
      map(([posts, users]) => {
        const enrichedPosts = this.mergePostsWithUsers(
          posts.map(post => ({ ...post, syncStatus: 'synced' })),
          users
        );
        this.dbService.savePosts(enrichedPosts);
        return this.filterPosts(enrichedPosts, searchTerm);
      })
    );
  }

  getComments(postId: number): Observable<Comment[]> {
    if (!this.isOnline) {
      return from(this.dbService.getCommentsByPostId(postId));
    }

    return this.http.get<Comment[]>(`${this.API_URL}/posts/${postId}/comments`).pipe(
      tap(comments => this.dbService.saveComments(comments))
    );
  }

  createPost(post: Post): Observable<Post> {
    
    const tempId = -Math.floor(Math.random() * 1000000);
    const newPost = { 
      ...post, 
      id: tempId,
      syncStatus: this.isOnline ? 'syncing' : 'pending',
      createdAt: new Date().toISOString()
    };
  
    if (!this.isOnline) {
      return from(this.dbService.savePost(newPost)).pipe(map(() => newPost));
    }
  
    return this.http.post<Post>(`${this.API_URL}/posts`, newPost).pipe(
      map(response => ({ ...newPost, id: response.id, syncStatus: 'synced' })),
      catchError(error => {
        newPost.syncStatus = 'failed';
        this.dbService.savePost(newPost);
        return throwError(() => error);
      })
    );
  }

  updatePost(post: Post): Observable<Post> {
    const updatedPost = { ...post, syncStatus: this.isOnline ? 'syncing' : 'pending' };

    if (!this.isOnline) {
      return from(this.dbService.savePost(updatedPost)).pipe(map(() => updatedPost));
    }

    return this.http.put<Post>(`${this.API_URL}/posts/${post.id}`, updatedPost).pipe(
      map(() => ({ ...updatedPost, syncStatus: 'synced' })),
      catchError(error => {
        updatedPost.syncStatus = 'failed';
        this.dbService.savePost(updatedPost);
        return throwError(() => error);
      })
    );
  }

  private filterPosts(posts: Post[], searchTerm?: string): Post[] {
    if (!searchTerm) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term) ||
      post.userName.toLowerCase().includes(term) ||
      post.userEmail?.toLowerCase().includes(term)
    );
  }
}