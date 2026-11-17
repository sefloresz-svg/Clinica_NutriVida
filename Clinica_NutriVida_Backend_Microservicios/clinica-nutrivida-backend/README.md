# Backend - Clínica NutriVida

Proyecto inicial de backend con arquitectura de microservicios para integrarse con el frontend React + TypeScript existente.

## Módulos

| Módulo | Puerto | Base de datos | Responsabilidad |
|---|---:|---|---|
| eureka-server | 8761 | No utiliza | Registro y descubrimiento |
| api-gateway | 8090 | No utiliza | Entrada única para el frontend |
| auth | 8080 | nutrivida_auth | Registro e inicio de sesión inicial |
| pacientes | 8081 | nutrivida_pacientes | CRUD de pacientes |
| nutricionistas | 8082 | nutrivida_nutricionistas | CRUD de nutricionistas |
| citas | 8083 | nutrivida_citas | CRUD de citas |
| servicios | 8084 | nutrivida_servicios | CRUD de servicios nutricionales |

## Requisitos

- JDK 21
- Maven 3.9 o superior
- MySQL 8 (Laragon puede utilizarse)
- IDE: IntelliJ IDEA o VS Code con extensiones Java

## 1. Crear las bases de datos

En Laragon, inicia MySQL y abre HeidiSQL/phpMyAdmin o tu cliente SQL. Ejecuta `database/create-databases.sql`.

Cada microservicio utiliza una base de datos independiente.

## 2. Configurar credenciales

Los `application.properties` vienen configurados para MySQL local:
- usuario: `root`
- contraseña: vacía

Si tu MySQL tiene otra contraseña, modifica `spring.datasource.password` en cada microservicio.

## 3. Orden para iniciar

Desde la carpeta raíz, abre terminales separadas y ejecuta:

```bash
mvn -pl eureka-server spring-boot:run
mvn -pl api-gateway spring-boot:run
mvn -pl auth spring-boot:run
mvn -pl pacientes spring-boot:run
mvn -pl nutricionistas spring-boot:run
mvn -pl citas spring-boot:run
mvn -pl servicios spring-boot:run
```

También puedes compilar todos los módulos desde la raíz:

```bash
mvn clean install
```

## 4. Direcciones

- Eureka: http://localhost:8761
- API Gateway: http://localhost:8090
- Auth: http://localhost:8080
- Pacientes: http://localhost:8081
- Nutricionistas: http://localhost:8082
- Citas: http://localhost:8083
- Servicios: http://localhost:8084

## 5. Rutas desde el Gateway

- `/api/auth/**` -> auth
- `/api/pacientes/**` -> pacientes
- `/api/nutricionistas/**` -> nutricionistas
- `/api/citas/**` -> citas
- `/api/servicios/**` -> servicios

Ejemplo:
`GET http://localhost:8090/api/pacientes`

## 6. Endpoints iniciales

### Auth
- `POST /api/auth/registro`
- `POST /api/auth/login`

Ejemplo registro:
```json
{
  "nombre": "Administrador NutriVida",
  "correo": "admin@nutrivida.cl",
  "password": "Cambiar123!",
  "rol": "ADMIN"
}
```

Ejemplo login:
```json
{
  "correo": "admin@nutrivida.cl",
  "password": "Cambiar123!"
}
```

### Pacientes
- `GET /api/pacientes`
- `GET /api/pacientes/{id}`
- `POST /api/pacientes`
- `PUT /api/pacientes/{id}`
- `DELETE /api/pacientes/{id}`

Ejemplo:
```json
{
  "nombre": "Juan Pérez",
  "rut": "12345678-9",
  "correo": "juan@correo.cl",
  "telefono": "+56912345678",
  "fechaNacimiento": "2000-05-20"
}
```

### Nutricionistas
- `GET /api/nutricionistas`
- `GET /api/nutricionistas/{id}`
- `POST /api/nutricionistas`
- `PUT /api/nutricionistas/{id}`
- `DELETE /api/nutricionistas/{id}`

### Servicios
- `GET /api/servicios`
- `GET /api/servicios/{id}`
- `POST /api/servicios`
- `PUT /api/servicios/{id}`
- `DELETE /api/servicios/{id}`

### Citas
- `GET /api/citas`
- `GET /api/citas/{id}`
- `POST /api/citas`
- `PUT /api/citas/{id}`
- `DELETE /api/citas/{id}`

## Importante: estado de esta entrega

Este ZIP genera una **base inicial de arquitectura y CRUD**. El inicio de sesión almacena contraseñas con BCrypt, pero todavía no emite JWT ni protege los endpoints con roles. Eso debe agregarse antes de considerar la autenticación lista para producción o para una evaluación que exija seguridad JWT.

Las citas guardan los identificadores de paciente, nutricionista y servicio. La validación de que esos registros existan en los otros microservicios es una integración entre servicios que debe implementarse en la siguiente etapa.

El frontend React original no se modifica ni se incluye dentro de este ZIP. La integración se realizará después, consumiendo el Gateway desde React.
