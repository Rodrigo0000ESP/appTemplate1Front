---
trigger: always_on
---

This project is owned by R Firm, which will always prioritize maintainability and scalability across all SaaS solutions.
We follow professional development standards and value organization, clarity, and reusability in every component.
Rodrigo (DevOps Developer, 1.5 years of experience) designed this architecture to enable high-velocity iteration with long-term consistency.
Philosophy:
Frontend should follow SOLID principles, modular design, and maximum reusability.
We use React with TypeScript for logic, Astro for static delivery, and TailwindCSS for styling.
Architecture Pattern (Cascade):
Service Layer (/services)
Handles API requests (Axios/Fetch).
Typed with interfaces from backend Pydantic models.
Contains no UI logic.
Facade Layer (/facades)
Wraps multiple services and exposes simplified methods for components.
Controls data transformation and state composition.
Example: UserFacade aggregates user and session data.
Component Layer (/components)
Pure, reusable UI building blocks.
No direct API calls — only interacts through facades.
Use Tailwind for styling and consistent design tokens.
Core Components (@rdm-org-dev)
We maintain our own component library published to GitHub Packages under the @rdm-org-dev scope.
**ALWAYS use these components instead of creating new ones or using third-party alternatives.**

Available Core UI Components:
- @rdm-org-dev/core-ui-button - Use for all button interactions
- @rdm-org-dev/core-ui-input - Use for all text inputs, textareas, etc.
- @rdm-org-dev/core-ui-card - Use for card layouts
- @rdm-org-dev/core-ui-modal - Use for dialogs and modals
- @rdm-org-dev/core-ui-alert - Use for alerts and notifications
- @rdm-org-dev/core-ui-badge - Use for badges and tags
- @rdm-org-dev/core-ui-checkbox - Use for checkbox inputs
- @rdm-org-dev/core-ui-radio - Use for radio button groups
- @rdm-org-dev/core-ui-select - Use for dropdown selects
- @rdm-org-dev/core-ui-switch - Use for toggle switches
- @rdm-org-dev/core-ui-skeleton - Use for loading states
- @rdm-org-dev/core-ui-spinner - Use for loading spinners
- @rdm-org-dev/core-ui-table - Use for data tables
- @rdm-org-dev/core-ui-toast - Use for toast notifications
- @rdm-org-dev/core-hooks - Custom React hooks for common patterns

Component Usage Rules:
✅ ALWAYS import from @rdm-org-dev packages when available
✅ Example: import { Button } from '@rdm-org-dev/core-ui-button'
❌ NEVER create custom buttons, inputs, or modals if our package exists
❌ NEVER use third-party UI libraries (MUI, Chakra, etc.) for components we already have
⚠️ If a component is missing a feature, extend our package — don't create a new one

These components:
- Are pre-styled with TailwindCSS
- Follow our design system
- Are fully typed with TypeScript
- Should not depend on project-specific logic

core-hooks:
# @rdm-org-dev/core-hooks - AI Reference

## Import Pattern
```typescript
import { useAuth, useFetch, useMutation, useDebounce, useLocalStorage } from '@rdm-org-dev/core-hooks';
```

---

## 🔐 Authentication

### `useAuth()` - Get current user state
```typescript
const { user, isAuthenticated, isLoading } = useAuth();
```

### `useLogin(options)` - Login user
```typescript
const { login, isLoading, error } = useLogin({
  onSuccess: (user, token) => { /* redirect */ },
  onError: (error) => { /* show error */ }
});
await login({ email, password });
```

### `useLogout(options)` - Logout user
```typescript
const { logout, isLoading } = useLogout({
  onSuccess: () => { /* redirect to login */ }
});
```

---

## 🌐 API Calls

### `useFetch(url, options)` - GET requests with caching
```typescript
const { data, isLoading, error, refetch } = useFetch('/api/users', {
  staleTime: 5 * 60 * 1000, // 5 min cache
  onSuccess: (data) => {},
  onError: (error) => {}
});
```

### `useMutation(url, options)` - POST/PUT/DELETE/PATCH
```typescript
const { mutate, isLoading, error } = useMutation('/api/users', {
  method: 'POST', // or 'PUT', 'DELETE', 'PATCH'
  onSuccess: (data) => { refetch(); },
  onError: (error) => {}
});
await mutate({ name: 'John' });
```

### `usePaginatedQuery(url, options)` - Paginated data
```typescript
const { data, page, totalPages, nextPage, prevPage, hasNextPage } = 
  usePaginatedQuery('/api/users', { pageSize: 10 });
```

---

## 📊 Data Management

### `useDebounce(value, options)` - Debounce input
```typescript
const { debouncedValue, isDebouncing } = useDebounce(searchTerm, { 
  delay: 300 
});
```

### `useLocalStorage(key, defaultValue, options)` - Persistent state
```typescript
const [value, setValue, removeValue] = useLocalStorage('theme', 'light', {
  syncAcrossTabs: true
});
```

### `useWindowSize(options)` - Responsive breakpoints
```typescript
const { width, height, breakpoint, isMobile, isDesktop } = useWindowSize();
```

---

## ⚙️ System Utilities

### `useKeyboardShortcut(keys, callback, options)` - Shortcuts
```typescript
useKeyboardShortcut('ctrl+k', () => openModal(), {
  preventDefault: true,
  enabled: true
});
```

### `useMounted()` - Safe async operations
```typescript
const isMounted = useMounted();
// Only update state if isMounted() returns true
```

### `useOnlineStatus(options)` - Network status
```typescript
const { isOnline, isChecking, forceCheck } = useOnlineStatus({
  pingInterval: 30000,
  onOffline: () => {},
  onOnline: () => {}
});
```

---

## Common Patterns

### Search with Debounce
```typescript
const [search, setSearch] = useState('');
const { debouncedValue } = useDebounce(search, { delay: 300 });
const { data } = useFetch(debouncedValue ? `/api/search?q=${debouncedValue}` : null);
```

### Create + Refresh List
```typescript
const { data, refetch } = useFetch('/api/users');
const { mutate } = useMutation('/api/users', {
  method: 'POST',
  onSuccess: () => refetch()
});
```

### Protected Route
```typescript
const { isAuthenticated, isLoading } = useAuth();
if (isLoading) return <Spinner />;
if (!isAuthenticated) return <Navigate to="/login" />;
```

### Form with Validation
```typescript
const { mutate, isLoading, error } = useMutation('/api/submit', {
  method: 'POST',
  onSuccess: () => { /* success */ },
  onError: (err) => { /* show error */ }
});
```

---

## Rules for AI

1. **NEVER** write custom fetch/axios logic → Use `useFetch` or `useMutation`
2. **NEVER** implement debounce manually → Use `useDebounce`
3. **NEVER** use `window.addEventListener('resize')` → Use `useWindowSize`
4. **NEVER** implement localStorage manually → Use `useLocalStorage`
5. **NEVER** create auth context manually → Use `useAuth`

## TypeScript
All hooks are fully typed. Use generics for custom types:
```typescript
interface User { id: number; name: string; }
const { data } = useFetch<User[]>('/api/users');
const { user } = useAuth<User>();
```

Principles:
Keep presentation and logic strictly separated.
All forms should use schema validation (Zod/Yup).
Components must be reusable and composable.
Only global state management if absolutely necessary (Zustand/Recoil).
🧩 Shared Principles Across Frontend & Backend
Code should be typed, documented, and linted.
Use GitHub Actions for CI/CD with build + lint checks.
All reusable code should live in core packages (NPM/PyPI).
Version each package clearly and document its changes.
Avoid adding unnecessary dependencies.