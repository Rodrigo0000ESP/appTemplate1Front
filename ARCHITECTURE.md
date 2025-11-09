# App Architecture

## ✅ Completado

Se ha implementado la arquitectura completa siguiendo los principios de R Firm:

### 📦 Estructura Creada

```
app/src/
├── services/
│   └── user.apiService.ts       # ✅ Usa @rdm-org-dev/core-api
├── facades/
│   └── user.facade.ts            # ✅ Agrega lógica de negocio
├── components/
│   ├── App.tsx                   # ✅ Componente principal
│   ├── feature-header/
│   │   └── Header.tsx            # ✅ Header con auth state
│   └── auth/
│       ├── LoginForm.tsx         # ✅ Formulario de login
│       ├── RegisterForm.tsx      # ✅ Formulario de registro
│       └── index.ts
└── pages/
    └── demo.astro                # ✅ Página de demostración
```

---

## 🏗️ Arquitectura en Capas

### 1. Service Layer (`/services`)
**Responsabilidad**: Llamadas directas a la API

```typescript
// user.apiService.ts
import { AuthService } from '@rdm-org-dev/core-api';

export class UserAuthService {
  async login(credentials: LoginRequest) {
    return await AuthService.login(credentials);
  }
}
```

**Características**:
- ✅ Sin lógica de negocio
- ✅ Solo wrappea `@rdm-org-dev/core-api`
- ✅ Puede agregar logging, métricas, etc.

---

### 2. Facade Layer (`/facades`)
**Responsabilidad**: Lógica de negocio y agregación

```typescript
// user.facade.ts
export class UserFacade {
  async login(credentials: LoginRequest) {
    // 1. Login
    const tokenResponse = await userAuthService.login(credentials);
    
    // 2. Obtener datos del usuario
    const user = await userAuthService.getCurrentUser();
    
    // 3. Retornar datos agregados
    return { user, token: tokenResponse.access_token };
  }
}
```

**Características**:
- ✅ Combina múltiples servicios
- ✅ Transforma datos
- ✅ Lógica de negocio específica de la app

---

### 3. Component Layer (`/components`)
**Responsabilidad**: UI y presentación

```typescript
// LoginForm.tsx
import { userFacade } from '../../facades/user.facade';

export function LoginForm({ onSuccess }: LoginFormProps) {
  const handleSubmit = async (e) => {
    await userFacade.login(formData);
    onSuccess?.();
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Características**:
- ✅ Solo usa facades (nunca servicios directamente)
- ✅ Usa componentes de `@rdm-org-dev/core-ui-*`
- ✅ Maneja estado local con `useState`

---

## 🎯 Flujo de Datos

```
Usuario interactúa
    ↓
Component (LoginForm.tsx)
    ↓
Facade (user.facade.ts)
    ↓
Service (user.apiService.ts)
    ↓
Core API (@rdm-org-dev/core-api)
    ↓
Backend (FastAPI)
```

---

## 🔧 Componentes Creados

### Header Component
**Ubicación**: `/components/feature-header/Header.tsx`

**Funcionalidad**:
- Muestra usuario autenticado o botones de login/registro
- Carga datos del usuario automáticamente
- Maneja logout

**Props**:
```typescript
interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}
```

---

### LoginForm Component
**Ubicación**: `/components/auth/LoginForm.tsx`

**Funcionalidad**:
- Formulario de login con validación
- Manejo de errores
- Estados de carga

**Props**:
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}
```

---

### RegisterForm Component
**Ubicación**: `/components/auth/RegisterForm.tsx`

**Funcionalidad**:
- Formulario de registro con validación
- Confirmación de contraseña
- Validación de fortaleza de contraseña

**Props**:
```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}
```

---

## 🚀 Cómo Usar

### 1. Configurar API Base URL

En tu archivo de entrada o layout principal:

```typescript
import { apiClient } from '../../../packages/core-api/src';

// Configurar URL del backend
apiClient.setBaseUrl('http://localhost:8000');
```

### 2. Usar en una Página Astro

```astro
---
import { App } from '../components/App';
---

<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <App client:load />
  </body>
</html>
```

### 3. O Usar Componentes Individualmente

```tsx
import { Header } from './components/feature-header/Header';
import { LoginForm } from './components/auth/LoginForm';

function MyPage() {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <>
      <Header 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => {}}
      />
      
      {showLogin && (
        <LoginForm onSuccess={() => setShowLogin(false)} />
      )}
    </>
  );
}
```

---

## 📝 Principios Seguidos

### ✅ Separation of Concerns
- Services: Solo API calls
- Facades: Lógica de negocio
- Components: Solo UI

### ✅ Reusabilidad
- Todos los componentes son reutilizables
- Facades pueden usarse en múltiples componentes
- Services pueden usarse en múltiples facades

### ✅ Type Safety
- Todo está tipado con TypeScript
- Tipos compartidos desde `@rdm-org-dev/core-api`

### ✅ Componentes Core
- Usa `@rdm-org-dev/core-ui-button`
- Usa `@rdm-org-dev/core-ui-input`
- Usa `@rdm-org-dev/core-ui-alert`

---

## 🧪 Testing

Para probar la implementación:

1. Inicia tu backend FastAPI:
   ```bash
   # En tu proyecto backend
   uvicorn main:app --reload --port 8000
   ```

2. Inicia el frontend:
   ```bash
   cd app
   npm run dev
   ```

3. Visita: `http://localhost:4321/demo`

---

## 🔄 Próximos Pasos

1. **Publicar `@rdm-org-dev/core-api`** a GitHub Packages
2. **Actualizar imports** para usar el paquete publicado
3. **Agregar más servicios** (Stripe, Email, Plans)
4. **Crear más componentes** reutilizables
5. **Agregar tests** unitarios y de integración

---

## 📚 Referencias

- **Core API Package**: `/packages/core-api/`
- **Architecture Doc**: `/packages/core-api/ARCHITECTURE.md`
- **Publishing Guide**: `/packages/core-api/PUBLISHING.md`
