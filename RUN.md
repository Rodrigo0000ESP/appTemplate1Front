# 🚀 Cómo Ejecutar el Proyecto

## ✅ Cambios Realizados

1. **ChakraProvider** - Toda la app está envuelta correctamente
2. **Imports corregidos** - `header.tsx` (minúscula) 
3. **Componentes @rdm-org-dev** - Usando tus componentes core

## 📋 Pasos para Ejecutar

### 1. Instalar Dependencias

```bash
cd /Users/rodrigodiazmunoz/Programmer/ComponentTester/app
npm install
```

### 2. Iniciar Backend (en otra terminal)

```bash
# En tu proyecto de FastAPI
uvicorn main:app --reload --port 8000
```

### 3. Iniciar Frontend

```bash
cd /Users/rodrigodiazmunoz/Programmer/ComponentTester/app
npm run dev
```

### 4. Abrir en el Navegador

```
http://localhost:4321/demo
```

## 🏗️ Estructura Actual

```
App (con ChakraProvider)
  ├── Header (con auth state)
  ├── Home View
  ├── LoginForm
  └── RegisterForm
```

## ✅ Componentes Usados

- `@rdm-org-dev/core-ui-button` ✅
- `@rdm-org-dev/core-ui-input` ✅  
- `@rdm-org-dev/core-ui-alert` ✅
- `@chakra-ui/react` (via ChakraProvider) ✅

## 🔧 Configuración API

El cliente API está configurado para apuntar a:
```typescript
apiClient.setBaseUrl('http://localhost:8000');
```

Si tu backend está en otro puerto, edita:
`/app/src/components/App.tsx` línea 14

## 📝 Notas

- **ChakraProvider** envuelve toda la app para que los componentes `@rdm-org-dev` funcionen
- **Header** se actualiza automáticamente cuando el usuario hace login
- **Facade pattern** implementado correctamente
- **Service layer** usa `@rdm-org-dev/core-api`

## 🐛 Si hay errores

1. **"Cannot find module"** → `npm install`
2. **"Port already in use"** → Cambia el puerto o mata el proceso
3. **"API connection failed"** → Verifica que el backend esté corriendo en puerto 8000
