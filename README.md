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

1. **Laragon** con MySQL encendido (Start All) y las 3 bases creadas vacías en HeidiSQL:
   ```sql
   CREATE DATABASE usuarios;
   CREATE DATABASE contenido;
   CREATE DATABASE atenciones;
   ```
   Las tablas y los datos de prueba los crea Flyway al arrancar cada microservicio.
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

## Tests

Front (Vitest + Testing Library), en esta carpeta:
```
npm run test
```

Back (JUnit 5 + Mockito, no necesitan MySQL), dentro de `usuarios`, `contenido` o `atenciones`:
```
./mvnw test -Dtest="*ServiceTest"
```
