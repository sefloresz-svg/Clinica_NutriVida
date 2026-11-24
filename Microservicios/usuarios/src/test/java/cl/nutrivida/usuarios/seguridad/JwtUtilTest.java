package cl.nutrivida.usuarios.seguridad;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

// Tests de JwtUtil: no necesitan MySQL, solo crean tokens y simulan peticiones con el header
class JwtUtilTest {

    private final JwtUtil jwtUtil = new JwtUtil("NutriVidaClaveSecretaParaFirmarTokensJWT2026", 120);

    // Simula una peticion HTTP que trae (o no) el header Authorization
    private MockHttpServletRequest peticionCon(String header) {
        MockHttpServletRequest peticion = new MockHttpServletRequest();
        if (header != null) {
            peticion.addHeader("Authorization", header);
        }
        return peticion;
    }

    @Test
    void elTokenGuardaElIdDelUsuario() {
        String token = jwtUtil.generarToken(5L, "Paciente");

        Long id = jwtUtil.obtenerIdUsuario(peticionCon("Bearer " + token));

        assertEquals(5L, id);
    }

    @Test
    void unAdminPuedeEntrarAEndpointsDeAdmin() {
        String token = jwtUtil.generarToken(1L, "Admin");

        assertEquals(1L, jwtUtil.obtenerIdAdmin(peticionCon("Bearer " + token)));
    }

    @Test
    void unPacienteNoPuedeEntrarAEndpointsDeAdmin() {
        String token = jwtUtil.generarToken(5L, "Paciente");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> jwtUtil.obtenerIdAdmin(peticionCon("Bearer " + token)));
        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
    }

    @Test
    void sinTokenResponde401() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> jwtUtil.obtenerIdUsuario(peticionCon(null)));
        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
    }

    @Test
    void unTokenModificadoResponde401() {
        // Si alguien cambia el token (por ejemplo para ponerse rol Admin) la firma deja de calzar
        String token = jwtUtil.generarToken(5L, "Paciente") + "x";

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> jwtUtil.obtenerIdUsuario(peticionCon("Bearer " + token)));
        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
    }
}
