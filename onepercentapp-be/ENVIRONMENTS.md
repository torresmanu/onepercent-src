# 🌍 Configuración de Entornos - One Percent App

Este documento explica cómo manejar los diferentes entornos de desarrollo en la aplicación One Percent App.

## 📋 Entornos Disponibles

### 🏠 **Local** (`environment.local.ts`)
- **Backend**: `http://localhost:3000`
- **Base de datos**: `__App_OnePercent_LOCAL_DB`
- **Uso**: Desarrollo con backend local
- **Comando**: `npm run start:local`

### 🚀 **Development** (`environment.ts`)
- **Backend**: `https://onepercentapp-api-dev.armadilloamarillo.cloud`
- **Base de datos**: `__App_OnePercent_DEV_DB`
- **Uso**: Desarrollo con backend deployado (dev)
- **Comando**: `npm run start:dev` o `npm start`

### 🔧 **Integration** (`environment.int.ts`)
- **Backend**: `https://onepercentapp-api-int.armadilloamarillo.cloud`
- **Base de datos**: `__App_OnePercent_DEV_DB`
- **Uso**: Testing de integración
- **Comando**: `npm run build --configuration=integration`

### 🏭 **Production** (`environment.prod.ts`)
- **Backend**: `https://onepercentapp-api-int.armadilloamarillo.cloud`
- **Base de datos**: `__App_OnePercent_DEV_DB`
- **Uso**: Producción
- **Comando**: `npm run start:prod` o `npm run build:prod`

## 🛠️ Comandos Disponibles

### Servidor de Desarrollo
```bash
# Local (backend en localhost:3000)
npm run start:local

# Development (backend deployado dev)
npm run start:dev
npm start  # Por defecto usa development

# Production (backend deployado prod)
npm run start:prod
```

### Build para Producción
```bash
# Local
npm run build:local

# Development
npm run build:dev

# Production
npm run build:prod
npm run build  # Por defecto usa production
```

## 🔄 Cambiar Entre Entornos

### Método 1: Usar comandos específicos (Recomendado)
```bash
# Para desarrollo local
npm run start:local

# Para desarrollo con backend deployado
npm run start:dev
```

### Método 2: Modificar angular.json
Puedes cambiar el `defaultConfiguration` en la sección `serve` del archivo `angular.json`:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "configurations": {
    // ... configuraciones ...
  },
  "defaultConfiguration": "local"  // Cambiar aquí
}
```

## 🔧 Configuración de Firebase

Todos los entornos comparten la misma configuración de Firebase para mantener la consistencia en autenticación y notificaciones push.

## 📱 Verificación de Entorno

Para verificar qué entorno estás usando:

1. **En el navegador**: Abre las herramientas de desarrollador (F12)
2. **Ve a Console**: Busca logs que muestren la URL del backend
3. **En Network**: Verifica las llamadas a la API para confirmar la URL base

## 🚨 Notas Importantes

- **Local**: Requiere que el backend esté corriendo en `localhost:3000`
- **Development/Integration/Production**: Requieren conexión a internet
- **Firebase**: La configuración es la misma para todos los entornos
- **Base de datos**: Cada entorno puede usar una base de datos diferente

## 🔍 Troubleshooting

### Backend Local No Responde
```bash
# Verificar que el backend esté corriendo
curl http://localhost:3000

# Si no responde, iniciar el backend local
cd path/to/backend
npm start
```

### Cambio de Entorno No Funciona
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
rm package-lock.json
npm install

# Reiniciar el servidor
npm run start:local
```

### CORS Errors
Si tienes problemas de CORS con el backend local, asegúrate de que el backend tenga configurado CORS para `http://localhost:4200`.

## 📚 Estructura de Archivos

```
src/environments/
├── environment.ts          # Development (default)
├── environment.local.ts    # Local development
├── environment.int.ts      # Integration
└── environment.prod.ts     # Production
```

---

**Última actualización**: $(date)
**Versión**: 1.0.0

