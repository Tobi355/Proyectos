# Canvas - Red social para diseñadores y artistas digitales

Canvas es una aplicación web monopágina (SPA) construida con Vue 3, Vite, Tailwind CSS y Supabase. Permite a los usuarios registrarse, iniciar sesión, crear publicaciones, dar likes, comentar y ver perfiles de otros usuarios.

## Características

- Autenticación de usuarios (registro, inicio de sesión, cierre de sesión)
- Feed de publicaciones en tiempo real
- Creación de publicaciones con texto e imagen opcional
- Sistema de likes y comentarios en tiempo real
- Perfiles de usuario con biografía y avatar
- Edición de perfil (nombre de usuario, biografía, avatar, contraseña)
- Diseño moderno y responsive inspirado en Behance, Dribbble, Threads, Linear y Framer
- Efectos 3D sutiles usando Three.js
- Animaciones y transiciones fluidas
- Modo oscuro con estética premium

## Tecnologías utilizadas

- **Vue 3** - Framework progresivo para construir interfaces de usuario
- **Vite** - Bundler de desarrollo rápido
- **Tailwind CSS** - Framework de CSS utility-first
- **Supabase** - Plataforma backend como servicio (PostgreSQL, Auth, Storage, Realtime)
- **Three.js** - Biblioteca 3D para efectos visuales sutiles
- **Vue Router** - Enrutamiento para SPA
- **Pinia** - Gestión de estado (opcional, actualmente no usado pero listo para expandir)

## Configuración del proyecto

### Requisitos previos

- Node.js (v16 o superior)
- npm o yarn
- Una cuenta en [Supabase](https://supabase.com)

### Pasos para configurar

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd canvas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copia el archivo `.env.example` a `.env`
   - Llena las variables con los valores de tu proyecto Supabase:
     ```
     VITE_SUPABASE_URL=tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
     ```

4. **Configurar la base de datos en Supabase**
   - Crea un nuevo proyecto en Supabase
   - Ejecuta el SQL ubicado en `supabase/schema.sql` en el editor SQL de Supabase para crear las tablas y políticas de seguridad

5. **Configurar los buckets de almacenamiento**
   - En el panel de Supabase, ve a Storage y crea los siguientes buckets públicos:
     - `post-images` - Para almacenar imágenes de publicaciones
     - `avatars` - Para almacenar avatares de usuarios

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## Estructura del proyecto

```
src/
├── assets/                 # Recursos estáticos
├── components/             # Componentes reutilizables
├── composables/            # Funciones compuestas
├── layouts/                # Layouts de la aplicación
├── pages/                  # Páginas (vistas)
├── router/                 # Configuración de rutas
├── services/               # Servicios para lógica de negocio
├── stores/                 # Almacenes de estado (Pinia)
├── supabase/               # Configuración y esquemas de Supabase
├── utils/                  # Utilidades y helpers
├── App.vue                 # Componente raíz
└── main.js                 # Punto de entrada
```

## Características implementadas

### Autenticación
- Registro de usuarios con email y password
- Inicio de sesión con credenciales
- Cierre de sesión
- Persistencia de sesión mediante localStorage (manejado por Supabase)
- Actualización de datos de usuario (username, bio, avatar)
- Cambio de contraseña

### Feed
- Visualización de publicaciones globales ordenadas por fecha
- Actualizaciones en tiempo real mediante Supabase Realtime
- Creación de publicaciones con texto e imagen opcional
- Sistema de likes (dar/quitar like) con actualización en tiempo real
- Sistema de comentarios (crear y ver) con tiempo relativo

### Perfiles
- Visualización de perfil de cualquier usuario
- Mostrar avatar, username, bio y publicaciones del usuario
- Edición de perfil propio (username, bio, avatar, contraseña)

### Diseño y experiencia de usuario
- Diseño oscuro moderno con elementos premium
- Efectos de glassmorphism y sombras suaves
- Transiciones de página con desvanecimiento
- Efectos 3D sutiles usando Three.js en el fondo
- Diseño completamente responsive (móvil, tablet, escritorio)
- Microinteracciones en botones y elementos interactivos
- Estados de carga y vacíos elegantes

## Próximos pasos (para expandir el proyecto)

- Implementar seguimiento de usuarios
- Añadir notificaciones en tiempo real
- Mejorar la funcionalidad de búsqueda
- Añadir categorías o tags para publicaciones
- Implementar sistema de mensajes directos
- Mejorar la accesibilidad (ARIA labels, navegación con teclado)
- Añadir pruebas unitarias y de integración
- Optimizar el rendimiento (lazy loading, code splitting)

## Licencia

Este proyecto está creado con fines educativos para la materia "Clientes Web Mobile". No tiene licencia específica para uso comercial.

## Créditos

- Inspiración en diseños de Behance, Dribbble, Threads, Linear y Framer
- Construido con Vue 3, Vite, Tailwind CSS y Supabase
- Efectos 3D utilizando Three.js