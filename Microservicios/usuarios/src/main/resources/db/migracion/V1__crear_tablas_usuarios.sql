-- Tablas del microservicio usuarios
CREATE TABLE usuario(
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    rut VARCHAR(12) NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATETIME NOT NULL,
    PRIMARY KEY (id_usuario),
    CONSTRAINT uk_usuario_correo UNIQUE (correo),
    CONSTRAINT uk_usuario_rut UNIQUE (rut)
);

CREATE TABLE nutricionista(
    id_nutricionista BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    especialidad VARCHAR(150) NOT NULL,
    foto_url VARCHAR(500) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_nutricionista),
    CONSTRAINT uk_nutricionista_usuario UNIQUE (id_usuario),
    -- FK real: las dos tablas estan en la misma base de datos
    CONSTRAINT fk_nutricionista_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
