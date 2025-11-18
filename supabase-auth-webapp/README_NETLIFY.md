Preparación para desplegar en Netlify

1) Resumen
- Este proyecto sirve archivos estáticos desde la carpeta `public`.
- El comando `npm run build` copia el contenido de `src/` a `public/` para que Netlify publique la versión más reciente.

2) Flujo recomendado
- Hacer cambios en `src/` durante el desarrollo.
- Ejecutar localmente para comprobar:

```bash
npm run build
npm start
# abrir http://localhost:8080
```

3) Despliegue en Netlify
- Desde la interfaz de Netlify (o usando la CLI), configura el repositorio.
- En la configuración de Build & Deploy usa:
  - Build command: `npm run build`
  - Publish directory: `public`

4) Archivos añadidos para Netlify
- `netlify.toml` — configuración del build y redirects.
- `public/_redirects` — regla para SPA (redirige todas las rutas a `index.html`).

5) Seguridad
- Nunca publiques la `service_role` key de Supabase en el frontend. Guárdala solo en funciones serverless/Backend.

6) Notas
- Si prefieres que Netlify sirva directamente desde `src/`, cambia `publish` en `netlify.toml` y ajusta `build` en `package.json`.
