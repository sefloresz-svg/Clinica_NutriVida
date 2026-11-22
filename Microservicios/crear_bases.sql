-- Ejecutar UNA vez en HeidiSQL (Laragon > Base de datos) antes de levantar los microservicios.
-- Solo se crean las bases vacias: las tablas y los datos los crea Flyway al arrancar.
CREATE DATABASE IF NOT EXISTS usuarios;
CREATE DATABASE IF NOT EXISTS contenido;
CREATE DATABASE IF NOT EXISTS atenciones;
