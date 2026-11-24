-- Datos iniciales del microservicio usuarios
-- Las contrasenas van YA encriptadas con BCrypt:
--   Admin:          admin@nutrivida.cl     -> Admin1234
--   Nutricionistas: cfuentes@nutrivida.cl  -> Nutri1234 (igual para los 4)
--   Pacientes:      paciente@gmail.com     -> Paciente1234 (igual para los 2)

INSERT INTO usuario (id_usuario, nombre, rut, correo, contrasena, rol, activo, fecha_registro) VALUES
(1, 'Administrador General', NULL, 'admin@nutrivida.cl', '$2a$10$v3utg/yrgi3YR.8QJ46dxe1p5pQZZLBmaX3dBZJRqTneWR247yF5.', 'Admin', TRUE, NOW()),
(2, 'Carolina Fuentes M.', NULL, 'cfuentes@nutrivida.cl', '$2a$10$q4sEHb4tg5gyP8m4RsE1DeOd2oJNebbBI7a1n00xFM9Wa5JWEb4L.', 'Nutricionista', TRUE, NOW()),
(3, 'Rodrigo Sepúlveda A.', NULL, 'rsepulveda@nutrivida.cl', '$2a$10$q4sEHb4tg5gyP8m4RsE1DeOd2oJNebbBI7a1n00xFM9Wa5JWEb4L.', 'Nutricionista', TRUE, NOW()),
(4, 'Daniela Morales C.', NULL, 'dmorales@nutrivida.cl', '$2a$10$q4sEHb4tg5gyP8m4RsE1DeOd2oJNebbBI7a1n00xFM9Wa5JWEb4L.', 'Nutricionista', TRUE, NOW()),
(5, 'Felipe Araya R.', NULL, 'faraya@nutrivida.cl', '$2a$10$q4sEHb4tg5gyP8m4RsE1DeOd2oJNebbBI7a1n00xFM9Wa5JWEb4L.', 'Nutricionista', TRUE, NOW()),
(6, 'Juan Pérez', '12345678-5', 'paciente@gmail.com', '$2a$10$M9NWpHUGp9ANENP2wO/yt.LOuG8RgLSHPVfnpKJ4lMgFIjmAZXYvS', 'Paciente', TRUE, NOW()),
(7, 'Halam Dupre', '11111111-1', 'hdupre@gmail.com', '$2a$10$M9NWpHUGp9ANENP2wO/yt.LOuG8RgLSHPVfnpKJ4lMgFIjmAZXYvS', 'Paciente', TRUE, NOW());

-- Perfiles de los 4 nutricionistas (id_usuario 2 a 5)
INSERT INTO nutricionista (id_nutricionista, id_usuario, especialidad, foto_url, activo) VALUES
(1, 2, 'Nutrición Clínica y Pérdida de Peso', 'https://randomuser.me/api/portraits/women/44.jpg', TRUE),
(2, 3, 'Rendimiento Deportivo y Antropometría ISAK II', '/fotos/Rodrigo.jpg', TRUE),
(3, 4, 'Alimentación Vegetariana y Vegana', 'https://randomuser.me/api/portraits/women/68.jpg', TRUE),
(4, 5, 'Diabetes, Hipertensión y Salud Infantil', '/fotos/Felipe.jpg', TRUE);
