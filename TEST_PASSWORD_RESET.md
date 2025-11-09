# Test Password Reset Flow

## ✅ Correcciones Aplicadas

### Problema Identificado
El backend esperaba:
```json
{
  "email": "user@example.com"
}
```

Pero el tipo `PasswordResetRequest` tenía un campo extra `password` que causaba error 422.

### Solución Implementada

1. **Tipo corregido** (`packages/core-api/src/types/auth.ts`):
```typescript
export interface PasswordResetRequest {
  email: string;  // ✅ Solo email, sin password
}
```

2. **Service corregido** (`app/src/services/user.apiService.ts`):
```typescript
async sendPasswordResetEmail(email: string) {
  return await AuthService.sendPasswordResetEmail({ email }); // ✅ Objeto correcto
}
```

## 🧪 Cómo Probar

### 1. Desde la UI (Recomendado)

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Navega a `http://localhost:4321`

3. Click en "Sign in" → "Forgot your password?"

4. Ingresa un email válido registrado en tu sistema

5. Verifica que:
   - ✅ Se muestre mensaje de éxito
   - ✅ No aparezca error 422
   - ✅ El email se envíe correctamente

### 2. Verificar Request en DevTools

Abre las DevTools del navegador (F12) → Network tab:

**Request esperado:**
```
POST http://localhost:8000/api/v1/auth/send-password-reset-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response esperado (200):**
```json
{
  "detail": {
    "message": "Password reset email sent successfully",
    "type": "success"
  }
}
```

### 3. Test Manual con curl

```bash
curl -X POST http://localhost:8000/api/v1/auth/send-password-reset-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## 📋 Checklist de Verificación

- [x] Tipo `PasswordResetRequest` solo tiene campo `email`
- [x] `userApiService.sendPasswordResetEmail()` pasa objeto `{ email }`
- [x] `ApiClient` envía `Content-Type: application/json`
- [x] `ApiClient` hace `JSON.stringify(data)` del body
- [x] Componente `ForgotPassword` maneja `response.detail?.message`
- [x] Componente `ResetPassword` maneja `response.detail?.message`

## 🔍 Debugging

Si aún hay problemas, verifica:

1. **Backend está corriendo**: `http://localhost:8000/docs`
2. **CORS configurado**: Backend debe permitir requests desde frontend
3. **Email existe**: El email debe estar registrado en la BD
4. **Console logs**: Revisa errores en browser console

## 🎯 Flujo Completo

```
1. Usuario → ForgotPassword.tsx
   ↓
2. userFacade.sendPasswordResetEmail(email)
   ↓
3. userAuthService.sendPasswordResetEmail(email)
   ↓
4. AuthService.sendPasswordResetEmail({ email })  ← Objeto correcto
   ↓
5. apiClient.post('/send-password-reset-email', { email })
   ↓
6. fetch() con Content-Type: application/json
   ↓
7. Backend recibe JSON correcto
   ↓
8. Response con detail.message
```

## ✅ Estado Actual

Todo está configurado correctamente. El request ahora se envía como:

```javascript
fetch('http://localhost:8000/api/v1/auth/send-password-reset-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>' // Si está autenticado
  },
  body: JSON.stringify({ email: 'user@example.com' })
})
```

Esto coincide exactamente con lo que el backend espera. ✅
