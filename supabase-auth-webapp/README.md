# Supabase Auth Web App

Una aplicación web simple de autenticación con Supabase. **Sin dependencias - Solo HTML, CSS y JavaScript vanilla puro.**

## Características

✨ **Cero dependencias** - Sin npm, sin node_modules, sin compilación
🎨 **Diseño oscuro-rojo** - Colores negros (#0b0b0b) y rojos (#dc2626)
🎭 **Animaciones suaves** - Transiciones fluidas y efectos elegantes
🔐 **Autenticación Supabase** - Integración directa con API REST
📱 **Responsive** - Compatible con móvil y desktop
⚡ **Rápido** - Carga instantánea

## Estructura del Proyecto

```
supabase-auth-webapp
├── public
│   ├── index.html              # Interfaz principal (bienvenida + auth + dashboard)
│   ├── css
│   │   └── styles.css          # Estilos oscuro-rojo con animaciones
│   └── js
│       ├── app.js              # Lógica de interacciones
│       └── supabaseClient.js   # Cliente Supabase (API REST)
├── src                          # Fuentes originales (respaldo)
│   ├── js
│   ├── css
├── package.json                 # Metadata (sin dependencias)
├── .env.sample                  # Template de variables
└── README.md                    # Este archivo
```

## Inicio Rápido

### Opción 1: Con Python (recomendado - sin dependencias)

```bash
cd public
python3 -m http.server 8080
# Abre http://localhost:8080
```

### Opción 2: Con Node.js (si tienes instalado)

```bash
npm start
# Abre http://localhost:8080
```

### Opción 3: Servidor local simple

Abre `public/index.html` directamente en tu navegador (funciona offline excepto auth).

## Configuración

1. **Credenciales Supabase** ya incluidas en `public/js/supabaseClient.js`:
   - URL: `https://mcdpamudmzczlahorjzj.supabase.co`
   - API Key: Incluida (anon key - segura para cliente)

2. (Opcional) Crear archivo `.env`:
   ```
   SUPABASE_URL=https://mcdpamudmzczlahorjzj.supabase.co
   SUPABASE_ANON_KEY=tu_clave_aqui
   ```

## Uso

### Pantalla de Bienvenida
- Título "Lorem Ipsum" con descripción
- Botones: "Iniciar Sesión" o "Registrarse"

### Registro
- Nombre Completo
- Email
- Número de Teléfono
- Contraseña

### Login
- Email
- Contraseña

### Dashboard
- Bienvenida personalizada
- Contenido Lorem Ipsum
- Botón para cerrar sesión

## Tecnología

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Backend**: Supabase (PostgreSQL + Auth)
- **Comunicación**: Fetch API REST (sin librerías)
- **Storage**: LocalStorage para sesiones

## Base de Datos

Para crear las tablas en Supabase, ejecuta el SQL en `SQL Editor`:

```sql
-- Ver archivo SETUP.sql en el repo
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Seguridad

⚠️ **Anon Key expuesta**: La clave pública está en el código. Para producción:

1. Restringir dominio en Supabase Console
2. Usar políticas RLS (Row Level Security)
3. Validar en backend

## Personalización

**Cambiar colores**: Edita `public/css/styles.css`
- Variables de color: `#dc2626` (rojo), `#0b0b0b` (negro)

**Cambiar textos**: Edita `public/index.html`
- Todos los textos son literales en HTML

**Cambiar animaciones**: Edita `public/css/styles.css`
- Keyframes: `@keyframes fadeIn`, `slideInUp`, etc.

## Sin Dependencias ✓

✅ Sin npm packages
✅ Sin build tools (webpack, vite, etc.)
✅ Sin transpilación
✅ Sin bundling
✅ JavaScript vanilla puro

Simplemente abre `public/index.html` con un servidor HTTP cualquiera.

## Navegadores Soportados

- Chrome/Edge 55+
- Firefox 52+
- Safari 10.1+
- Mobile browsers modernos

## License

MIT - Libre para usar y modificar

---

**¡Disfruta tu app sin dependencias!** 🚀