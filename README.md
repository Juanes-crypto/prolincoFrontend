📋 PROMPT COMPLETO DE CONTEXTO - PLATAFORMA ESTRATÉGICA PROLINCO
text
# CONTEXTO COMPLETO - PLATAFORMA ESTRATÉGICA PROLINCO

## 🎯 INFORMACIÓN GENERAL
**Empresa:** Lacteos Prolinco
**Tipo:** Plataforma web de gestión empresarial estratégica y operacional
**Stack:** MERN (MongoDB, Express.js, React, Node.js)
**Estado:** Producción activa

## 🏗️ ARQUITECTURA DEL SISTEMA

### FRONTEND (React + Vite)
src/
├── components/ # Componentes reutilizables
│ ├── AuthGuard.jsx # Protección de rutas por roles
│ ├── Card.jsx # Tarjetas UI consistentes
│ ├── EditableField.jsx # Campos editables en tiempo real
│ ├── EditModal.jsx # Modal para edición de contenido/URLs
│ ├── WhatsAppFloat.jsx # Botón flotante de WhatsApp
│ └── Sidebar.jsx # Navegación principal
├── context/ # Estado global
│ ├── AuthContextDefinition.js # Definición del contexto
│ └── AuthProvider.jsx # Proveedor de autenticación
├── hooks/ # Hooks personalizados
│ └── useOperationalData.js # Gestión centralizada de datos
├── pages/ # Vistas principales
│ ├── OperationalToolsPage.jsx # Plataforma estratégica principal
│ ├── ClientePage.jsx # Servicio al cliente (3 fases)
│ ├── TalentoHumanoPage.jsx # Recursos humanos
│ ├── AdministracionPage.jsx # Gestión administrativa
│ ├── Dashboard.jsx # Panel principal
│ ├── UserManagement.jsx # Gestión de usuarios (admin)
│ ├── AuditPage.jsx # Auditoría del sistema
│ ├── FilesPage.jsx # Gestión de archivos
│ └── History.jsx # Historial de cambios
└── api/
└── api.js # Configuración de Axios

text

### BACKEND (Node.js + Express)
backend/
├── controllers/
│ ├── authController.js # Autenticación y usuarios
│ ├── contentController.js # Gestión de contenido estratégico
│ ├── auditController.js # Registros de auditoría
│ ├── documentController.js # Manejo de documentos
│ └── userController.js # Operaciones de usuarios
├── models/
│ ├── User.js # Modelo de usuarios
│ ├── Content.js # Modelo de contenido estratégico
│ ├── AuditLog.js # Modelo de logs de auditoría
│ └── Document.js # Modelo de documentos
├── middleware/
│ ├── authMiddleware.js # Verificación de JWT
│ ├── auditMiddleware.js # Registro automático de acciones
│ └── uploadMiddleware.js # Manejo de archivos
└── routes/
├── authRoutes.js # Rutas de autenticación
├── contentRoutes.js # Rutas de contenido
├── auditRoutes.js # Rutas de auditoría
├── userRoutes.js # Rutas de usuarios
└── documentRoutes.js # Rutas de documentos

text

## 🔐 SISTEMA DE AUTENTICACIÓN Y ROLES

### Roles implementados:
- **admin:** Acceso completo a todas las funcionalidades
- **talento:** Acceso a Talento Humano y archivos
- **servicio:** Acceso a Servicio al Cliente
- **basico:** Acceso básico al dashboard
- **invitado:** Acceso limitado

### Flujo de autenticación:
1. Login → Verificación JWT → Redirección según rol
2. AuthGuard protege rutas según permisos
3. Contexto global maneja estado de usuario

## 📊 MÓDULOS PRINCIPALES

### 1. PLATAFORMA ESTRATÉGICA (OperationalToolsPage)
**Ruta:** `/plataforma`
- Navegación lateral entre 3 secciones principales
- Gestión centralizada con `useOperationalData`
- Arquitectura basada en props y hooks

### 2. SERVICIO AL CLIENTE (ClientePage)
**Estructura:**
- Diagnóstico (editable)
- Objetivo específico (editable) 
- 3 Fases del ciclo:
  - **Preventa:** Volantes digitales, carteles, formularios
  - **Venta:** Ofertas, ciclo de servicio, chat, WhatsApp
  - **Postventa:** Marketing, soporte, encuestas, PQRS

### 3. TALENTO HUMANO (TalentoHumanoPage)
**Herramientas Drive:**
- Organigrama, Mapa de procesos, Perfil de empleado
- Manual del empleado, Procesos de inducción/capacitación
- Integración directa con Google Drive

### 4. ADMINISTRACIÓN (AdministracionPage)
**Secciones:**
- Identidad organizacional (Misión, Visión, Valores)
- Marco legal (Drive)
- Matrices estratégicas (DOFA, PESTEL, EFI, EFE)

## 🔧 COMPONENTES CLAVE

### useOperationalData Hook
```javascript
// Gestión centralizada de todo el contenido estratégico
const { data, loading, error, refetch } = useOperationalData();
// Data estructura: { admin: {...}, servicio: {...}, talento: {...} }
EditableField Component
javascript
// Componente genérico para edición en tiempo real
<EditableField
  section="servicio"
  subsection="diagnostic" 
  onUpdate={refetch}
  initialContent={content}
/>
Sistema de Auditoría
Registro automático de todas las ediciones

Historial completo de cambios por usuario

Timestamps y datos de usuario en cada modificación

🔗 INTEGRACIONES EXTERNAS
Google Drive
URLs editables para documentos

Apertura en pestañas nuevas

Validación de permisos públicos

WhatsApp Business
Botón flotante en toda la aplicación

Número configurable: 573001234567

Mensaje predeterminado personalizable

🎨 SISTEMA DE DISEÑO
Colores (Tailwind CSS):
prolinco-primary: Amarillo corporativo

prolinco-secondary: Azul corporativo

prolinco-dark: Textos oscuros

prolinco-light: Fondos claros

Componentes UI:
Cards con hover effects

Modales consistentes

Sidebar con navegación por roles

Botones con estados interactivos

📱 FUNCIONALIDADES ESPECIALES
Edición en Tiempo Real
Campos editables para administradores

Guardado automático con feedback

Historial de cambios integrado

Navegación Inteligente
Rutas protegidas por roles

Redirecciones automáticas

Sidebar dinámico según permisos

Responsive Design
Mobile-first approach

Grid systems flexibles

Componentes adaptables

🚀 FLUJOS DE TRABAJO
Para Administradores:
Login → Dashboard → Plataforma Estratégica

Navegar entre secciones

Editar contenido/URLs en tiempo real

Gestionar usuarios y permisos

Revisar auditoría e historial

Para Usuarios Regulares:
Login → Dashboard → Sección asignada

Consultar herramientas y documentos

Usar enlaces a Drive/WhatsApp

Ver contenido de solo lectura

text

---

## 📖 **README.md COMPLETO Y PROFESIONAL**

```markdown
# 🥛 Plataforma Estratégica Prolinco

Sistema integral de gestión empresarial para Lacteos Prolinco, diseñado para centralizar y optimizar los procesos estratégicos, operacionales y de recursos humanos.

## 🚀 Características Principales

### 📊 Módulos Estratégicos
- **Servicio al Cliente**: Gestión del ciclo completo de ventas (Preventa, Venta, Postventa)
- **Talento Humano**: Documentos operativos y herramientas de RRHH integradas con Google Drive
- **Administración**: Identidad organizacional, marco legal y matrices estratégicas

### 🔐 Sistema de Seguridad
- Autenticación JWT con roles múltiples
- 5 niveles de acceso (admin, talento, servicio, basico, invitado)
- Protección de rutas y componentes por permisos
- Auditoría completa de todas las acciones

### ✨ Funcionalidades Avanzadas
- Edición en tiempo real sin recarga de página
- Historial automático de cambios
- Integración con Google Drive y WhatsApp Business
- Diseño responsive y experiencia de usuario optimizada
- Botón flotante de WhatsApp en toda la aplicación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Sistema de diseño
- **Axios** - Cliente HTTP
- **React Router DOM** - Navegación
- **Heroicons** - Iconografía

### Backend  
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación
- **CORS** - Configuración de dominios

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- MongoDB 4.4+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd prolinco-platform
2. Configurar Backend
bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Configurar variables en .env
MONGODB_URI=mongodb://localhost:27017/prolinco
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=5000
3. Configurar Frontend
bash
cd frontend
npm install

# Configurar variables en .env
VITE_API_URL=http://localhost:5000/api
4. Ejecutar la aplicación
bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
La aplicación estará disponible en:

Frontend: http://localhost:5173

Backend: http://localhost:5000

👥 Roles de Usuario
Administrador (admin)
Acceso completo a todos los módulos

Gestión de usuarios y permisos

Edición de todo el contenido estratégico

Acceso a auditoría e historial

Talento Humano (talento)
Acceso a módulo de Talento Humano

Gestión de documentos operativos

Visualización de herramientas de RRHH

Servicio al Cliente (servicio)
Acceso a módulo de Servicio al Cliente

Visualización de herramientas de ventas

Consulta de fases del ciclo de servicio

Básico (basico)
Acceso limitado al dashboard

Funcionalidades básicas de consulta

Invitado (invitado)
Acceso mínimo para consultas generales

🏗️ Arquitectura del Proyecto
Frontend Structure
text
src/
├── components/     # Componentes reutilizables
├── context/        # Estado global (Auth)
├── hooks/          # Custom hooks
├── pages/          # Vistas principales  
├── api/            # Configuración API
└── App.jsx         # Componente raíz
Backend Structure
text
backend/
├── controllers/    # Lógica de negocio
├── models/         # Esquemas de BD
├── middleware/     # Interceptores
├── routes/         # Definición de rutas
└── server.js       # Servidor principal
🔄 Flujos de Trabajo Principales
Gestión de Contenido Estratégico
Acceso: Usuario admin ingresa a Plataforma Estratégica

Navegación: Selecciona sección (Cliente, Talento, Admin)

Edición: Haz clic en "Editar" en cualquier campo

Guardado: Los cambios se persisten automáticamente

Auditoría: El sistema registra automáticamente el cambio

Integración con Google Drive
Configuración: Admin sube documento a Drive y configura permisos públicos

URL: Copia el enlace público de Drive

Asignación: En la plataforma, haz clic en "Cambiar URL" y pega el enlace

Acceso: Los usuarios pueden abrir documentos con un clic

Gestión de Usuarios
Creación: Admin crea usuarios en Gestión de Usuarios

Asignación de Rol: Define permisos según el área

Notificación: Usuario recibe credenciales

Acceso: Usuario accede según sus permisos

🎨 Personalización
Configuración de WhatsApp
Editar src/components/WhatsAppFloat.jsx:

javascript
const phoneNumber = '573001234567'; // Reemplazar con número real
const defaultMessage = 'Hola, me gustaría conocer más...'; // Personalizar mensaje
Colores Corporativos
Modificar en tailwind.config.js:

javascript
theme: {
  extend: {
    colors: {
      'prolinco-primary': '#FFD700',    // Amarillo
      'prolinco-secondary': '#1E3A8A',  // Azul  
      'prolinco-dark': '#1F2937',       // Gris oscuro
      'prolinco-light': '#F3F4F6',      // Gris claro
    }
  }
}
📊 API Endpoints Principales
Autenticación
POST /api/auth/login - Inicio de sesión

POST /api/auth/register - Registro (admin only)

PUT /api/auth/change-password - Cambio de contraseña

Contenido Estratégico
GET /api/content/:section - Obtener contenido por sección

PUT /api/content/:section - Actualizar contenido

GET /api/content/:section/history - Historial de cambios

Usuarios
GET /api/users - Listar usuarios (admin only)

PUT /api/users/:id - Actualizar usuario

DELETE /api/users/:id - Eliminar usuario

Auditoría
GET /api/audit/logs - Registros de auditoría (admin only)

🐛 Solución de Problemas Comunes
Error 404 en API
Verificar que el backend esté ejecutándose en puerto 5000

Confirmar que las variables de entorno estén configuradas

Revisar que MongoDB esté activo

Problemas de Autenticación
Limpiar localStorage y cookies

Verificar que el token JWT no haya expirado

Confirmar permisos de usuario en la base de datos

Errores de CORS
Verificar configuración CORS en backend

Confirmar que las URLs estén correctas en frontend

Problemas con Google Drive
Asegurar que los documentos tengan permisos públicos

Verificar que las URLs sean válidas

Confirmar que no haya restricciones de organización

🤝 Contribución
Reportar Issues
Verificar que el issue no esté ya reportado

Proporcionar steps para reproducir

Incluir versión del sistema y logs de error

Desarrollo de Nuevas Funcionalidades
Crear branch desde develop

Seguir convenciones de código existentes

Incluir tests cuando sea posible

Documentar cambios en API cuando aplique

📞 Soporte
Para soporte técnico o preguntas sobre el sistema:

Desarrollador Principal: [Tu nombre/contacto]

Documentación: [Enlace a documentación completa]

Issues: [Repositorio de GitHub]

📄 Licencia
Este proyecto es propiedad de Lacteos Prolinco - Todos los derechos reservados © 2024

¿Necesitas ayuda? Revisa la documentación completa o contacta al equipo de desarrollo.

text

---

## 🎯 **ARCHIVOS ADICIONALES RECOMENDADOS**

Te sugiero crear también:

### **1. .env.example**
Backend
MONGODB_URI=mongodb://localhost:27017/prolinco
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
PORT=5000

Frontend
VITE_API_URL=http://localhost:5000/api

text

### **2. DEPLOYMENT_GUIDE.md**
```markdown
# Guía de Deployment

## Producción - Configuración
- MongoDB Atlas para base de datos
- Render para frontend
- Render para backend
- Variables de entorno en cada plataforma

## Scripts de Build
```bash
# Frontend
npm run build

# Backend  
npm start