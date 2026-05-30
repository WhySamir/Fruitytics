# React Starter Kit

A modern, production-ready React starter kit with TypeScript, Vite, Redux Toolkit, and Tailwind CSS.

## Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 19** - Latest React features
- 🔷 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS
- 🗃️ **Redux** - Plain Redux state management with type safety
- 🔒 **Security** - Best practices implemented
- 📦 **Code Splitting** - Automatic route-based splitting
- 🎯 **Feature-Based Architecture** - Scalable folder structure
- 🛡️ **Error Handling** - Centralized error reporting
- 📝 **Type Safety** - Comprehensive TypeScript types

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your configuration
# APP_BASE_URL=https://api.example.com
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  features/          # Feature-based modules
    auth/            # Authentication feature
      components/
      hooks/
      store/
      types/
    data/            # Data management feature
  shared/            # Shared code
    components/      # Reusable components
    hooks/           # Reusable hooks
    services/        # API, storage, etc.
    types/           # Shared types
    utils/           # Utility functions
    store/           # Redux store
  components/        # Global components
  pages/             # Page components
  config/            # Configuration
  utils/             # Legacy utilities (being migrated)
```

## Key Concepts

### State Management (Plain Redux)

This project uses **plain Redux** with explicit action creators and reducers. We use `immer` for immutable updates and maintain full type safety.

**Example:**
```typescript
import { useAuth } from './features/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, setUser } = useAuth();
  
  // Use auth state and actions
}
```

### API Calls

Use the centralized API service:

```typescript
import { apiGet, apiPost } from './shared/services/api';

// GET request
const users = await apiGet<User[]>('/api/users', {
  authorization: true,
});

// POST request
const newUser = await apiPost<User>('/api/users', userData, {
  authorization: true,
  successMsg: 'User created successfully',
});
```

### Protected Routes

Protect routes with authentication and authorization:

```typescript
import { ProtectedRoute } from './shared/components';

<Route
  path="/admin"
  element={
    <ProtectedRoute
      allowedRoles={['admin']}
      allowedPermissions={['manage:users']}
      LayoutComponent={AdminLayout}
    />
  }
>
  <Route index element={<Dashboard />} />
</Route>
```

### Environment Variables

Environment variables are validated on startup:

```typescript
import { env } from './config/env';

const apiUrl = env.APP_BASE_URL;
```

See `.env.example` for required variables.

## Security

### Important Security Notes

1. **API Keys**: Never store API keys in frontend code. All API authentication should be handled server-side.

2. **Token Storage**: Currently uses sessionStorage (for development). In production, use httpOnly cookies.

3. **Environment Variables**: All required env vars are validated on app startup.

4. **Error Messages**: Error messages are sanitized to prevent information leakage.

## Development Guidelines

### Adding a New Feature

1. Create feature folder:
   ```
   src/features/my-feature/
     components/
     hooks/
     store/
     types/
     index.ts
   ```

2. Create Redux slice:
   ```typescript
   // features/my-feature/store/myFeatureSlice.ts
   import { createSlice } from '@reduxjs/toolkit';
   
   const myFeatureSlice = createSlice({
     name: 'myFeature',
     initialState: {},
     reducers: {},
   });
   ```

3. Add to store:
   ```typescript
   // shared/store/index.ts
   import { myFeatureReducer } from '../../features/my-feature/store';
   
   reducer: {
     // ...
     myFeature: myFeatureReducer,
   }
   ```

4. Create custom hook:
   ```typescript
   // features/my-feature/hooks/useMyFeature.ts
   export function useMyFeature() {
     // ...
   }
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing patterns
- Add JSDoc comments for public APIs
- Use functional components with hooks
- Prefer composition over inheritance

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Dependencies

### Core
- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router

### UI
- Tailwind CSS v4
- Lucide React (icons)
- Formik (forms)
- Yup (validation)

## Migration

If you're migrating from the old structure, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

## Code Review

For detailed code analysis and improvement recommendations, see [CODE_REVIEW.md](./CODE_REVIEW.md).

## License

See LICENSE file.

## Contributing

1. Follow the project structure
2. Add TypeScript types
3. Write JSDoc comments
4. Follow security best practices
5. Test your changes
