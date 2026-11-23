package cl.nutrivida.usuarios.service;

import cl.nutrivida.usuarios.dto.LoginDTO;
import cl.nutrivida.usuarios.dto.RegistroDTO;
import cl.nutrivida.usuarios.dto.UsuarioCrearDTO;
import cl.nutrivida.usuarios.model.Usuario;
import cl.nutrivida.usuarios.repository.NutricionistaRepository;
import cl.nutrivida.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Tests unitarios: el repositorio y el encoder son simulados (@Mock), asi que NO necesitan MySQL
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NutricionistaRepository nutricionistaRepository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @InjectMocks
    private UsuarioService usuarioService;

    // Datos de un registro valido (el RUT 12345678-5 cumple el Modulo 11)
    private RegistroDTO crearRegistro(String rut) {
        RegistroDTO dto = new RegistroDTO();
        dto.setNombre("Ana Soto");
        dto.setRut(rut);
        dto.setCorreo("ana@gmail.com");
        dto.setContrasena("Ana12345");
        return dto;
    }

    // Comprueba que un RUT con digito verificador incorrecto se rechaza con 400 y no se guarda nada
    @Test
    void registroRechazaRutInvalido() {
        RegistroDTO dto = crearRegistro("12345678-0");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> usuarioService.registrar(dto));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    // Comprueba que el registro publico siempre guarda el rol "Paciente" y la contrasena encriptada
    @Test
    void registroSiempreGuardaRolPaciente() {
        when(encoder.encode("Ana12345")).thenReturn("hash-bcrypt");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        usuarioService.registrar(crearRegistro("12345678-5"));

        // Se "atrapa" el usuario que se mando a guardar para revisar sus datos
        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        assertEquals("Paciente", captor.getValue().getRol());
        assertEquals("hash-bcrypt", captor.getValue().getContrasena());
    }

    // Comprueba que el login con contrasena incorrecta responde 401
    @Test
    void loginConContrasenaIncorrectaLanza401() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("admin@nutrivida.cl");
        usuario.setContrasena("hash-bcrypt");
        when(usuarioRepository.findByCorreo("admin@nutrivida.cl")).thenReturn(Optional.of(usuario));
        when(encoder.matches("ClaveMala1", "hash-bcrypt")).thenReturn(false);

        LoginDTO dto = new LoginDTO();
        dto.setCorreo("admin@nutrivida.cl");
        dto.setContrasena("ClaveMala1");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> usuarioService.login(dto));

        assertEquals(HttpStatus.UNAUTHORIZED, error.getStatusCode());
        assertEquals("Correo o contraseña incorrectos.", error.getReason());
    }

    // Comprueba la regla nueva: el Admin no puede crear un "Nutricionista" sin perfil (400)
    @Test
    void crearConRolNutricionistaLanza400() {
        Usuario admin = new Usuario();
        admin.setId(1L);
        admin.setRol("Admin");
        admin.setActivo(true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(admin));

        UsuarioCrearDTO dto = new UsuarioCrearDTO();
        dto.setNombre("Pedro Rojas");
        dto.setCorreo("projas@nutrivida.cl");
        dto.setContrasena("Nutri1234");
        dto.setRol("Nutricionista");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> usuarioService.crear(dto, 1L));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        assertEquals("Para crear un nutricionista use la página Nutricionistas.", error.getReason());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
