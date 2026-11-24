-- Opcional: los microservicios ya crean su base solos (createDatabaseIfNotExist=true).
-- Si se quiere crearlas a mano, ejecutar en HeidiSQL (Laragon > Base de datos).
-- Solo se crean las bases vacias: las tablas y los datos los crea Flyway al arrancar.
CREATE DATABASE IF NOT EXISTS usuarios;
CREATE DATABASE IF NOT EXISTS contenido;
CREATE DATABASE IF NOT EXISTS atenciones;
