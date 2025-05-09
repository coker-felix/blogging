# Blog App with Offline Support

A Web App built with Angular that allows users to manage blog posts and comments with offline support.

## Tech Stack

- **Frontend Framework**: Angular 17.3.17
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide Angular
- **Database**: IndexedDB (via idb library)
- **API**: JSONPlaceholder (https://jsonplaceholder.typicode.com)

## Features

- View, create, edit, and delete blog posts
- Add and view comments
- Offline support with background sync
- Search posts by title, body, or author
- Filter comments by email
- Real-time sync status indicators
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/coker-felix/blogging>
cd blogging
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Offline Support Implementation

### IndexedDB Implementation

We use the `idb` library to work with IndexedDB, providing:
- Structured database with separate stores for posts, comments, and users
- Promise-based API for easier async operations
- Type-safe operations with TypeScript

Database Structure:
```typescript
interface StoreSchema {
  posts: Post;
  comments: Comment;
  users: User;
}
```

Key Features:
- Automatic caching of API responses
- Offline data persistence
- Background sync when coming back online
- Sync status tracking for posts and comments

### What Works Offline

✅ Available Offline:
- Viewing cached posts and comments
- Creating new posts
- Editing existing posts
- Adding new comments
- Searching through cached content
- Post and comment sync status indicators

⚠️ Limitations:
- New posts/comments created offline will have temporary negative IDs
- Search only works on cached content
- User data is read-only

### Sync Strategy

1. **Posts and Comments**:
   - New items created offline are marked as 'pending'
   - Items are synced when connection is restored
   - Failed sync attempts are marked as 'failed'
   - Successful syncs are marked as 'synced'

2. **Data Freshness**:
   - Posts and users use a network-first strategy
   - Comments use a cache-first strategy
   - All data is cached for offline use

## Development

### Project Structure
```
src/
├── app/
│ ├── components/
│ │ ├── posts/
│ │ ├── post-detail/
│ │ ├── create-edit-post/
│ │ ├── comment-list/
│ │ └── create-comment/
│ ├── services/
│ │ ├── posts.service.ts
│ │ └── db.service.ts
│ └── types/
│ └── post.interface.ts
```

### Building for Production

```bash
npm run build
```

The production build will be available in the `dist/` directory.

## Known Issues

1. Conflict resolution for concurrent edits is not implemented
2. No retry mechanism for failed sync attempts
3. Limited error handling for network timeouts
4. No pagination for large datasets

## Future Improvements

- [ ] Add retry mechanism for failed syncs
- [ ] Implement conflict resolution
- [ ] Add pagination support
- [ ] Enhance offline image support
- [ ] Add unit and e2e tests