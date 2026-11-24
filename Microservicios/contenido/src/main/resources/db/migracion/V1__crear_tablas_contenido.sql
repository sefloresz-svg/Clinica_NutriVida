-- Tablas del microservicio contenido (no tienen FK entre ellas)
CREATE TABLE servicio(
    id_servicio BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    duracion VARCHAR(20) NOT NULL,
    modalidad VARCHAR(20) NOT NULL,
    precio INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id_servicio),
    CONSTRAINT uk_servicio_codigo UNIQUE (codigo)
);

CREATE TABLE novedad(
    id_novedad BIGINT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    resumen VARCHAR(500) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATE NOT NULL,
    imagen_url VARCHAR(500) NULL,
    PRIMARY KEY (id_novedad)
);

CREATE TABLE sucursal(
    id_sucursal BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    horario VARCHAR(255) NOT NULL,
    mapa_url VARCHAR(1000) NULL,
    PRIMARY KEY (id_sucursal)
);
