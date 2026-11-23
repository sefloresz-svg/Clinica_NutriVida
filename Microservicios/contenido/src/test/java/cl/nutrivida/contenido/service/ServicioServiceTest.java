package cl.nutrivida.contenido.service;

import cl.nutrivida.contenido.client.UsuarioClient;
import cl.nutrivida.contenido.dto.ServicioEntradaDTO;
import cl.nutrivida.contenido.dto.UsuarioDTO;
import cl.nutrivida.contenido.model.Servicio;
import cl.nutrivida.contenido.repository.ServicioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Tests unitarios: el repositorio y el cliente WebClient son simulados (@Mock), asi que NO necesitan MySQL.
// PermisoService se crea "de verdad" para probar su validacion real del Admin.
@ExtendWith(MockitoExtension.class)
class ServicioServiceTest {

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private UsuarioClient usuarioClient;

    private ServicioService servicioService;

    @BeforeEach
    void prepararService() {
        PermisoService permisoService = new PermisoService(usuarioClient);
        servicioService = new ServicioService(servicioRepository, permisoService);
    }

    private UsuarioDTO crearUsuario(Long id, String rol) {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setId(id);
        usuario.setNombre("Usuario " + id);
        usuario.setRol(rol);
        usuario.setActivo(true);
        return usuario;
    }

    private ServicioEntradaDTO crearEntrada(String codigo) {
        ServicioEntradaDTO dto = new ServicioEntradaDTO();
        dto.setCodigo(codigo);
        dto.setTitulo("Consulta Nutricional Integral");
        dto.setTipo("Consulta");
        dto.setDuracion("50 min");
        dto.setModalidad("Presencial");
        dto.setPrecio(35000);
        return dto;
    }

    // Comprueba que no se puede crear un servicio con un codigo que ya existe (400)
    @Test
    void noSePuedeCrearConCodigoRepetido() {
        when(usuarioClient.buscarUsuario(1L)).thenReturn(crearUsuario(1L, "Admin"));
        when(servicioRepository.existsByCodigo("CN001")).thenReturn(true);

        // Se manda en minuscula: el service lo pasa a mayuscula antes de comparar
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicioService.crear(crearEntrada("cn001"), 1L));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        assertEquals("Ya existe un servicio con el código CN001.", error.getReason());
        verify(servicioRepository, never()).save(any(Servicio.class));
    }

    // Comprueba que si quien pide el cambio no es Admin (aqui un paciente) se responde 403
    @Test
    void siNoEsAdminLanza403() {
        when(usuarioClient.buscarUsuario(6L)).thenReturn(crearUsuario(6L, "Paciente"));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicioService.crear(crearEntrada("CN003"), 6L));

        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
        verify(servicioRepository, never()).save(any(Servicio.class));
    }
}
