import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Post, Comment, User } from './types/post.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private db: Promise<IDBPDatabase> | null = null;
  private readonly DB_NAME = 'blogDB';
  private readonly VERSION = 1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.db = this.initDb();
    }
  }

  private initDb(): Promise<IDBPDatabase> {
    return openDB(this.DB_NAME, this.VERSION, {
      upgrade(db) {
        if (db.objectStoreNames.contains('posts')) {
          db.deleteObjectStore('posts');
        }
        if (db.objectStoreNames.contains('comments')) {
          db.deleteObjectStore('comments');
        }
        if (db.objectStoreNames.contains('users')) {
          db.deleteObjectStore('users');
        }

        db.createObjectStore('users', { keyPath: 'id' });
        const postStore = db.createObjectStore('posts', { keyPath: 'id' });
        postStore.createIndex('syncStatus', 'syncStatus');

        const commentStore = db.createObjectStore('comments', { keyPath: 'id' });
        commentStore.createIndex('postId', 'postId');
        commentStore.createIndex('syncStatus', 'syncStatus');

      }
    });
  }

  private async getDb(): Promise<IDBPDatabase> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('IndexedDB is not available in this environment');
    }
    if (!this.db) {
      this.db = this.initDb();
    }
    return this.db;
  }

  async saveUsers(users: User[]) {
    const db = await this.getDb();
    const tx = db.transaction('users', 'readwrite');
    await Promise.all(users.map(user => tx.store.put(user)));
    await tx.done;
  }

  async getUsers(): Promise<User[]> {
    const db = await this.getDb();
    return db.getAll('users');
  }

  async savePosts(posts: Post[]) {
    const db = await this.getDb();
    const tx = db.transaction('posts', 'readwrite');
    await Promise.all(posts.map(post => tx.store.put(post)));
    await tx.done;
  }

  async savePost(post: Post) {
    const db = await this.getDb();
    await db.put('posts', post);
  }

  async getPosts(): Promise<Post[]> {
    const db = await this.getDb();
    return db.getAll('posts');
  }

  async saveComments(comments: Comment[]) {
    const db = await this.getDb();
    const tx = db.transaction('comments', 'readwrite');
    await Promise.all(comments.map(comment => tx.store.put(comment)));
    await tx.done;
  }

  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const db = await this.getDb();
    const tx = db.transaction('comments', 'readonly');
    const index = tx.store.index('postId');
    return index.getAll(postId);
  }

  async getPendingItems(): Promise<{ posts: Post[], comments: Comment[] }> {
    const db = await this.getDb();
    const posts = await db.getAllFromIndex('posts', 'syncStatus', 'pending');
    const comments = await db.getAllFromIndex('comments', 'syncStatus', 'pending');
    return { posts, comments };
  }
}