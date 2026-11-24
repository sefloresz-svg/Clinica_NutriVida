-- Datos iniciales: los mismos que estaban en los arrays del front

INSERT INTO servicio (id_servicio, codigo, titulo, tipo, duracion, modalidad, precio, activo) VALUES
(1, 'CN001', 'Primera consulta nutricional', 'Consulta', '50 min', 'Presencial', 35000, TRUE),
(2, 'CN002', 'Control nutricional (seguimiento)', 'Consulta', '30 min', 'Presencial', 25000, TRUE),
(3, 'PL001', 'Plan pérdida de peso (1 mes)', 'Plan especializado', '1 mes', 'Presencial', 65000, TRUE),
(4, 'PL003', 'Plan nutrición deportiva (1 mes)', 'Plan especializado', '1 mes', 'Presencial', 70000, TRUE),
(5, 'PL005', 'Plan alimentación vegetariana/vegana', 'Plan especializado', '1 mes', 'Presencial', 68000, TRUE);

INSERT INTO novedad (id_novedad, titulo, categoria, resumen, contenido, fecha_publicacion, imagen_url) VALUES
(1, '5 Claves para Mantener una Hidratación Óptima', 'Consejo Nutricional',
 'El agua es fundamental para el metabolismo. Descubre cómo calcular tus requerimientos diarios según tu estilo de vida.',
 'La hidratación adecuada no solo previene la fatiga, sino que optimiza el rendimiento físico y cognitivo. Para calcular tus necesidades básicas, multiplica tu peso en kilos por 35 ml. No olvides priorizar el agua pura por encima de bebidas azucaradas o procesadas.',
 '2026-10-18', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&auto=format&fit=crop&q=80'),
(2, 'Mitos y Realidades del Ayuno Intermitente', 'Artículo Clínico',
 'Analizamos qué dice la evidencia científica actual sobre los protocolos 16/8 y su impacto en la sensibilidad a la insulina.',
 'El ayuno intermitente ha ganado popularidad, pero no es una solución mágica ni adecuada para todos los pacientes. Aunque muestra beneficios en el control glucémico y la flexibilidad metabólica, es imprescindible contar con supervisión profesional para evitar déficits nutricionales o atracones compensatorios.',
 '2026-10-12', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80'),
(3, 'Superalimentos Locales: El Valor Nutricional de la Quinua', 'Alimentación Saludable',
 'Conoce las propiedades de este pseudocereal rico en aminoácidos esenciales, fibra y minerales esenciales.',
 'La quinua es uno de los pocos alimentos vegetales que contiene los nueve aminoácidos esenciales. Además, su alto contenido en fibra de digestión lenta ayuda a mantener la saciedad durante más tiempo, convirtiéndola en una excelente opción para dietas orientadas al control de peso o diabetes.',
 '2026-10-05', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80');

INSERT INTO sucursal (id_sucursal, nombre, sector, direccion, telefono, correo, horario, mapa_url) VALUES
(1, 'Sucursal Av. Alemania (Casa Matriz)', 'Sector Av. Alemania', 'Av. Alemania 0820, Of. 402, Temuco', '+56 45 233 1122',
 'alemania@nutrivida.cl', 'Lunes a Viernes: 09:00 - 18:30 hrs | Sábados: 09:00 - 14:00 hrs',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.532381283621!2d-72.6038472234938!3d-38.73941498770857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c3327f32a7%3A0x280e224e75d6810a!2sAv.%20Alemania%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl'),
(2, 'Sucursal Temuco Centro', 'Sector Centro / Plaza de Armas', 'Calle Prat 540, Of. 302, Temuco', '+56 45 233 2233',
 'centro@nutrivida.cl', 'Lunes a Viernes: 08:30 - 19:00 hrs | Sábados: 09:00 - 13:00 hrs',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3!2d-72.5901!3d-38.7391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c300000000%3A0x123456789abcdef!2sArturo%20Prat%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl'),
(3, 'Sucursal Barrio Inglés', 'Sector Poniente', 'Av. Inés de Suárez 1250, Temuco', '+56 45 233 4455',
 'barrioingles@nutrivida.cl', 'Lunes a Viernes: 09:00 - 18:00 hrs',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.1!2d-72.6311!3d-38.7451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3e000000000%3A0xabcdef123456789!2sInes%20de%20Suarez%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl'),
(4, 'Sucursal Javiera Carrera', 'Sector Portal', 'Av. Javiera Carrera 890, Temuco', '+56 45 233 6677',
 'javieracarrera@nutrivida.cl', 'Lunes a Viernes: 09:00 - 18:30 hrs',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.7!2d-72.6201!3d-38.7511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3f000000000%3A0x9876543210fedcba!2sJaviera%20Carrera%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl');
