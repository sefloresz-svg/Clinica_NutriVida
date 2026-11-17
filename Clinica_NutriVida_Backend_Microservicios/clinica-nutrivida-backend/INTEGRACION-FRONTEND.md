# Integración posterior con React

El frontend permanece intacto en su proyecto original. Cuando el backend esté levantado, React debe consumir el Gateway en `http://localhost:8090`.

Se recomienda crear en React un archivo central, por ejemplo `src/servicios/api.ts`, para definir la URL base y funciones `fetch`/`axios`. No se ha modificado el frontend en este ZIP para evitar sobrescribir tu trabajo actual.

Antes de conectar el formulario de login, considera que este backend inicial devuelve los datos del usuario y todavía no genera token JWT. No uses este mecanismo como seguridad final hasta completar JWT y autorización por roles.
