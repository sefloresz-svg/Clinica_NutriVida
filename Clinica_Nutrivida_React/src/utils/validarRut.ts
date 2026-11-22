// Validación de RUT Chileno estricto (sin puntos, con guion y algoritmo Módulo 11).
// El back (microservicio usuarios) hace la misma validación.
export const validarRutChileno = (rut: string): boolean => {
  const rutLimpio = rut.trim().toUpperCase();

  const regexEstricto = /^\d{7,8}-[0-9K]$/;
  if (!regexEstricto.test(rutLimpio)) {
    return false;
  }

  const [cuerpo, dvIngresado] = rutLimpio.split("-");

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvEsperado = 11 - resto === 11 ? "0" : 11 - resto === 10 ? "K" : (11 - resto).toString();

  return dvIngresado === dvEsperado;
};
