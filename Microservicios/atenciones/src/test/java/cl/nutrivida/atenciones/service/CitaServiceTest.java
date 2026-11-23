package cl.nutrivida.atenciones.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import cl.nutrivida.atenciones.client.ContenidoClient;
import cl.nutrivida.atenciones.client.UsuarioClient;
import cl.nutrivida.atenciones.dto.CitaEntradaDTO;
import cl.nutrivida.atenciones.dto.EstadoDTO;
import cl.nutrivida.atenciones.dto.NutricionistaDTO;
import cl.nutrivida.atenciones.dto.ServicioDTO;
import cl.nutrivida.atenciones.dto.UsuarioDTO;
import cl.nutrivida.atenciones.model.Cita;
import cl.nutrivida.atenciones.repository.CitaRepository;
import cl.nutrivida.atenciones.repository.HorarioNutricionistaRepository;

@ExtendWith(MockitoExtension.class)
class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private HorarioNutricionistaRepository horarioRepository;

    @Mock
    private UsuarioClient usuarioClient;

    @Mock
    private ContenidoClient contenidoClient;

    @InjectMocks
    private CitaService citaService;

    private UsuarioDTO crearUsuario(Long id, String rol) {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setId(id);
        usuario.setNombre("Usuario " + id);
        usuario.setRol(rol);
        usuario.setActivo(true);
        return usuario;
    }

    private void simularPacienteNutricionistaYServicio() {
        when(usuarioClient.buscarUsuario(6L)).thenReturn(crearUsuario(6L, "Paciente"));

        NutricionistaDTO nutricionista = new NutricionistaDTO();
        nutricionista.setId(1L);
        nutricionista.setNombre("Carolina Fuentes M.");
        nutricionista.setActivo(true);
        when(usuarioClient.buscarNutricionista(1L)).thenReturn(nutricionista);

        ServicioDTO servicio = new ServicioDTO();
        servicio.setId(1L);
        servicio.setTitulo("Consulta Nutricional Integral");
        servicio.setPrecio(35000);
        servicio.setActivo(true);
        when(contenidoClient.buscarServicio(1L)).thenReturn(servicio);
    }

    private CitaEntradaDTO crearEntrada(LocalDate fecha) {
        CitaEntradaDTO dto = new CitaEntradaDTO();
        dto.setIdPaciente(6L);
        dto.setIdNutricionista(1L);
        dto.setIdServicio(1L);
        dto.setFecha(fecha);
        dto.setHora(LocalTime.of(9, 0));
        return dto;
    }

    private LocalDate proximoLunes() {
        return LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
    }

    private Cita crearCita(LocalDate fecha, String estado) {
        Cita cita = new Cita();
        cita.setId(1L);
        cita.setIdPaciente(6L);
        cita.setIdNutricionista(1L);
        cita.setIdServicio(1L);
        cita.setFecha(fecha);
        cita.setHora(LocalTime.of(9, 0));
        cita.setPrecio(35000);
        cita.setEstado(estado);
        return cita;
    }

    private EstadoDTO crearEstado(String estado) {
        EstadoDTO dto = new EstadoDTO();
        dto.setEstado(estado);
        return dto;
    }

    @Test
    void noSePuedeAgendarUnDomingo() {
        simularPacienteNutricionistaYServicio();
        LocalDate domingo = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> citaService.crear(crearEntrada(domingo)));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        assertEquals("La clínica atiende únicamente de Lunes a Sábado. Por favor, selecciona otro día.",
                error.getReason());
        verify(citaRepository, never()).save(any(Cita.class));
    }

    @Test
    void noSePuedeAgendarUnaHoraYaTomada() {
        simularPacienteNutricionistaYServicio();
        LocalDate lunes = proximoLunes();
        when(horarioRepository.existsByIdNutricionistaAndHora(1L, LocalTime.of(9, 0))).thenReturn(true);
        when(citaRepository.existsByIdNutricionistaAndFechaAndHoraAndEstadoNot(1L, lunes, LocalTime.of(9, 0), "Cancelada"))
                .thenReturn(true);

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> citaService.crear(crearEntrada(lunes)));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        assertEquals("Esa hora ya fue reservada. Por favor, selecciona otra.", error.getReason());
        verify(citaRepository, never()).save(any(Cita.class));
    }

    @Test
    void elPrecioSeCopiaDelServicio() {
        simularPacienteNutricionistaYServicio();
        when(horarioRepository.existsByIdNutricionistaAndHora(1L, LocalTime.of(9, 0))).thenReturn(true);
        when(citaRepository.save(any(Cita.class))).thenAnswer(invocacion -> invocacion.getArgument(0));

        citaService.crear(crearEntrada(proximoLunes()));

        ArgumentCaptor<Cita> captor = ArgumentCaptor.forClass(Cita.class);
        verify(citaRepository).save(captor.capture());
        assertEquals(35000, captor.getValue().getPrecio());
    }

    @Test
    void unPacienteNoPuedeConfirmarUnaCita() {
        when(citaRepository.findById(1L)).thenReturn(Optional.of(crearCita(proximoLunes(), "Pendiente")));
        when(usuarioClient.buscarUsuario(6L)).thenReturn(crearUsuario(6L, "Paciente"));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> citaService.cambiarEstado(1L, crearEstado("Confirmada"), 6L));

        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
        assertEquals("Un paciente solo puede cancelar sus citas.", error.getReason());
    }

    @Test
    void noSePuedeCancelarUnaCitaQueYaPaso() {
        when(citaRepository.findById(1L)).thenReturn(Optional.of(crearCita(LocalDate.of(2020, 1, 10), "Confirmada")));
        when(usuarioClient.buscarUsuario(1L)).thenReturn(crearUsuario(1L, "Admin"));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> citaService.cambiarEstado(1L, crearEstado("Cancelada"), 1L));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatusCode());
        assertEquals("No se puede cancelar una cita que ya pasó.", error.getReason());
        verify(citaRepository, never()).save(any(Cita.class));
    }
}
