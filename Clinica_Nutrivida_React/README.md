# Clínica NutriVida

Página web de la Clínica NutriVida (Temuco), hecha para el ramo de Desarrollo Fullstack.

- **Frontend** (esta carpeta): React + Vite + TypeScript + Bootstrap, ordenado con Atomic Design
  (`src/componentes/atomos`, `moleculas`, `organismos` y `src/paginas`).
- **Backend** (carpeta `../Microservicios`): Spring Boot con microservicios, Eureka y API Gateway.
  Cada microservicio tiene su propia base de datos MySQL.

| Servicio | Puerto | Base de datos |
|---|---|---|
| eureka-server | 8761 | — |
| api-gateway | 8080 | — |
| usuarios | 8081 | `usuarios` |
| contenido | 8082 | `contenido` |
| atenciones | 8083 | `atenciones` |

El front solo habla con el gateway (`http://localhost:8080`).

## Cómo levantar todo (en este orden)

1. **Laragon** con MySQL encendido (Start All). No hace falta crear las bases a mano:
   la URL de conexión trae `?createDatabaseIfNotExist=true`, así que cada microservicio crea su base
   vacía si no existe, y después Flyway crea las tablas y los datos de prueba.
   (Si se prefiere crearlas a mano, está el script `Microservicios/crear_bases.sql`).
2. **eureka-server**: `cd ../Microservicios/eureka-server` y `./mvnw spring-boot:run` (revisar http://localhost:8761).
3. **api-gateway**: `cd ../Microservicios/api-gateway` y `./mvnw spring-boot:run`.
4. **Los 3 microservicios**, cada uno en su terminal: `usuarios`, `contenido` y `atenciones` con `./mvnw spring-boot:run`.
5. **Front**, en esta carpeta:
   ```
   npm install
   npm run dev
   ```
   Abrir http://localhost:5173

## Usuarios de prueba

Vienen en `usuarios/src/main/resources/db/migracion/V2__datos_iniciales.sql`.

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@nutrivida.cl | Admin1234 |
| Nutricionista | cfuentes@nutrivida.cl | Nutri1234 |
| Nutricionista | rsepulveda@nutrivida.cl | Nutri1234 |
| Nutricionista | dmorales@nutrivida.cl | Nutri1234 |
| Nutricionista | faraya@nutrivida.cl | Nutri1234 |
| Paciente | paciente@gmail.com | Paciente1234 |
| Paciente | hdupre@gmail.com | Paciente1234 |

## Seguridad: login con JWT y roles

1. **Login** (`POST /api/usuarios/login`): el microservicio `usuarios` revisa la contraseña (BCrypt) y
   responde `{ token, usuario }`. El token (JWT) lleva el **id**, el **rol** y la **fecha de vencimiento**
   (2 horas), firmado con una clave secreta (`jwt.secreto` en `application.properties`).
2. **Front**: guarda el usuario y su token en `localStorage` (la sesión sobrevive a recargar la página).
   Cada petición protegida manda el header `Authorization: Bearer <token>` (`headersConToken()` en
   `src/utils/api.ts`). Si el token venció, `obtenerSesion()` borra la sesión, y si el back responde 401
   también se cierra.
3. **Back**: `JwtUtil` (en cada microservicio) valida la firma y el vencimiento del token y saca de ahí
   el id del usuario. Ya no se confía en un `?idAdmin=` que cualquiera podría inventar.
   - Sin token o token inválido/vencido → **401**.
   - Endpoint de Admin con un token de otro rol → **403**.
   - Además, cada service revisa en la base de datos que el usuario siga **activo** y con el rol correcto.
4. **Restricciones en el front**: el Navbar muestra solo las opciones del rol, y las páginas
   `/administrador`, `/agendar` y `/pacientes` redirigen si no hay sesión o el rol no corresponde.

## Swagger (documentación de la API)

Con cada microservicio levantado:

| Microservicio | Swagger |
|---|---|
| usuarios | http://localhost:8081/swagger-ui.html |
| contenido | http://localhost:8082/swagger-ui.html |
| atenciones | http://localhost:8083/swagger-ui.html |

Para probar endpoints protegidos: hacer login en `POST /api/usuarios/login`, copiar el `token` de la
respuesta, apretar **Authorize** y pegarlo.

## Tests

Front (Vitest + Testing Library), en esta carpeta:
```
npm run test
```

Back (JUnit 5 + Mockito, no necesitan MySQL), dentro de `usuarios`, `contenido` o `atenciones`:
```
./mvnw test -Dtest="*ServiceTest,JwtUtilTest"
```
