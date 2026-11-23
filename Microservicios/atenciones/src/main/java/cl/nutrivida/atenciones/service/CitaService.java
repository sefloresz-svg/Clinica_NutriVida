package cl.nutrivida.atenciones.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.nutrivida.atenciones.client.ContenidoClient;
import cl.nutrivida.atenciones.client.UsuarioClient;
import cl.nutrivida.atenciones.dto.CitaDTO;
import cl.nutrivida.atenciones.dto.CitaEntradaDTO;
import cl.nutrivida.atenciones.dto.EstadoDTO;
import cl.nutrivida.atenciones.dto.NutricionistaDTO;
import cl.nutrivida.atenciones.dto.ResumenCitasDTO;
import cl.nutrivida.atenciones.dto.ServicioDTO;
import cl.nutrivida.atenciones.dto.UsuarioDTO;
import cl.nutrivida.atenciones.model.Cita;
import cl.nutrivida.atenciones.model.HorarioNutricionista;
import cl.nutrivida.atenciones.repository.CitaRepository;
import cl.nutrivida.atenciones.repository.HorarioNutricionistaRepository;

@Service
public class CitaService {

    private static final String CANCELADA = "Cancelada";

    private final CitaRepository citaRepository;
    private final HorarioNutricionistaRepository horarioRepository;
    private final UsuarioClient usuarioClient;
    private final ContenidoClient contenidoClient;

    public CitaService(CitaRepository citaRepository,
                       HorarioNutricionistaRepository horarioRepository,
                       UsuarioClient usuarioClient,
                       ContenidoClient contenidoClient) {
        this.citaRepository = citaRepository;
        this.horarioRepository = horarioRepository;
        this.usuarioClient = usuarioClient;
        this.contenidoClient = contenidoClient;
    }

    public CitaDTO crear(CitaEntradaDTO dto) {
        validarPaciente(dto.getIdPaciente());
        validarNutricionista(dto.getIdNutricionista());
        ServicioDTO servicio = validarServicio(dto.getIdServicio());

        validarFechaYHora(dto.getFecha(), dto.getHora());
        validarHoraDelHorario(dto.getIdNutricionista(), dto.getHora());
        validarHoraLibre(dto);

        Cita cita = new Cita();
        cita.setIdPaciente(dto.getIdPaciente());
        cita.setIdNutricionista(dto.getIdNutricionista());
        cita.setIdServicio(dto.getIdServicio());
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setPrecio(servicio.getPrecio());
        if (dto.getMotivo() != null && !dto.getMotivo().trim().isEmpty()) {
            cita.setMotivo(dto.getMotivo().trim());
        }
        return aDTO(citaRepository.save(cita));
    }

    public List<CitaDTO> listar(Long idUsuario) {
        UsuarioDTO usuario = obtenerUsuarioActivo(idUsuario);
        List<Cita> citas;

        if (usuario.getRol().equals("Admin")) {
            citas = citaRepository.findAllByOrderByFechaAscHoraAsc();
        } else if (usuario.getRol().equals("Nutricionista")) {
            NutricionistaDTO nutricionista = usuarioClient.buscarNutricionistaPorUsuario(idUsuario);
            if (nutricionista == null) {
                citas = new ArrayList<>();
            } else {
                citas = citaRepository.findByIdNutricionistaOrderByFechaAscHoraAsc(nutricionista.getId());
            }
        } else {
            citas = citaRepository.findByIdPacienteOrderByFechaAscHoraAsc(idUsuario);
        }

        List<CitaDTO> lista = new ArrayList<>();
        for (Cita c : citas) {
            lista.add(aDTO(c));
        }
        return lista;
    }

    public List<LocalTime> horasDisponibles(Long idNutricionista, LocalDate fecha) {
        List<LocalTime> libres = new ArrayList<>();
        if (fecha.isBefore(LocalDate.now()) || fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return libres;
        }

        List<LocalTime> ocupadas = new ArrayList<>();
        for (Cita c : citaRepository.findByIdNutricionistaAndFechaAndEstadoNot(idNutricionista, fecha, CANCELADA)) {
            ocupadas.add(c.getHora());
        }

        for (HorarioNutricionista h : horarioRepository.findByIdNutricionistaOrderByHoraAsc(idNutricionista)) {
            boolean yaPaso = fecha.equals(LocalDate.now()) && !h.getHora().isAfter(LocalTime.now());
            if (!ocupadas.contains(h.getHora()) && !yaPaso) {
                libres.add(h.getHora());
            }
        }
        return libres;
    }

    public CitaDTO cambiarEstado(Long id, EstadoDTO dto, Long idUsuario) {
        String nuevoEstado = dto.getEstado().trim();
        if (!nuevoEstado.equals("Confirmada") && !nuevoEstado.equals("Atendida") && !nuevoEstado.equals(CANCELADA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El estado debe ser Confirmada, Atendida o Cancelada.");
        }
        Cita cita = obtener(id);
        UsuarioDTO usuario = obtenerUsuarioActivo(idUsuario);

        validarCitaModificable(cita);
        validarPermiso(cita, usuario, nuevoEstado);
        validarCambioDeEstado(cita, nuevoEstado);

        cita.setEstado(nuevoEstado);
        return aDTO(citaRepository.save(cita));
    }

    public void cancelar(Long id, Long idUsuario) {
        EstadoDTO dto = new EstadoDTO();
        dto.setEstado(CANCELADA);
        cambiarEstado(id, dto, idUsuario);
    }

    public ResumenCitasDTO resumen(Long idAdmin) {
        validarAdmin(idAdmin);
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);
        LocalDate finMes = hoy.withDayOfMonth(hoy.lengthOfMonth());

        long ingresos = 0;
        for (Cita c : citaRepository.findByFechaBetweenAndEstadoNot(inicioMes, finMes, CANCELADA)) {
            ingresos += c.getPrecio();
        }

        ResumenCitasDTO dto = new ResumenCitasDTO();
        dto.setCitasHoy(citaRepository.countByFechaAndEstadoNot(hoy, CANCELADA));
        dto.setCitasPendientes(citaRepository.countByEstado("Pendiente"));
        dto.setIngresosMes(ingresos);
        return dto;
    }

    private Cita obtener(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La cita no existe."));
    }

    private UsuarioDTO obtenerUsuarioActivo(Long idUsuario) {
        UsuarioDTO usuario = usuarioClient.buscarUsuario(idUsuario);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe.");
        }
        if (!usuario.getActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tu cuenta está desactivada.");
        }
        return usuario;
    }

    private UsuarioDTO validarPaciente(Long idPaciente) {
        UsuarioDTO paciente = obtenerUsuarioActivo(idPaciente);
        if (!paciente.getRol().equals("Paciente")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo los pacientes pueden agendar citas.");
        }
        return paciente;
    }

    private NutricionistaDTO validarNutricionista(Long idNutricionista) {
        NutricionistaDTO nutricionista = usuarioClient.buscarNutricionista(idNutricionista);
        if (nutricionista == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El nutricionista no existe.");
        }
        if (!nutricionista.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nutricionista ya no atiende en la clínica.");
        }
        return nutricionista;
    }

    private ServicioDTO validarServicio(Long idServicio) {
        ServicioDTO servicio = contenidoClient.buscarServicio(idServicio);
        if (servicio == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El servicio no existe.");
        }
        if (!servicio.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El servicio ya no está disponible.");
        }
        return servicio;
    }

    private void validarFechaYHora(LocalDate fecha, LocalTime hora) {
        LocalDate hoy = LocalDate.now();
        if (fecha.isBefore(hoy)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes seleccionar una fecha pasada.");
        }
        if (fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La clínica atiende únicamente de Lunes a Sábado. Por favor, selecciona otro día.");
        }
        if (fecha.equals(hoy) && !hora.isAfter(LocalTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Esa hora ya pasó. Selecciona una hora posterior.");
        }
    }

    private void validarHoraDelHorario(Long idNutricionista, LocalTime hora) {
        if (!horarioRepository.existsByIdNutricionistaAndHora(idNutricionista, hora)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La hora seleccionada no está dentro del horario del nutricionista.");
        }
    }

    private void validarHoraLibre(CitaEntradaDTO dto) {
        if (citaRepository.existsByIdNutricionistaAndFechaAndHoraAndEstadoNot(
                dto.getIdNutricionista(), dto.getFecha(), dto.getHora(), CANCELADA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Esa hora ya fue reservada. Por favor, selecciona otra.");
        }
        if (citaRepository.existsByIdPacienteAndFechaAndHoraAndEstadoNot(
                dto.getIdPaciente(), dto.getFecha(), dto.getHora(), CANCELADA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ya tienes otra cita agendada en esa fecha y hora.");
        }
    }

    private void validarCitaModificable(Cita cita) {
        if (cita.getEstado().equals(CANCELADA) || cita.getEstado().equals("Atendida")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede modificar una cita " + cita.getEstado().toLowerCase() + ".");
        }
    }

    private void validarCambioDeEstado(Cita cita, String nuevoEstado) {
        if (nuevoEstado.equals(cita.getEstado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La cita ya está " + cita.getEstado().toLowerCase() + ".");
        }
        if (nuevoEstado.equals("Confirmada") && !cita.getEstado().equals("Pendiente")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se puede confirmar una cita pendiente.");
        }
        boolean yaPaso = LocalDateTime.of(cita.getFecha(), cita.getHora()).isBefore(LocalDateTime.now());
        if (yaPaso && nuevoEstado.equals(CANCELADA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede cancelar una cita que ya pasó.");
        }
        if (yaPaso && nuevoEstado.equals("Confirmada")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede confirmar una cita que ya pasó.");
        }
        if (nuevoEstado.equals("Atendida") && cita.getFecha().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede marcar como atendida una cita que aún no ocurre.");
        }
    }

    private void validarAdmin(Long idAdmin) {
        UsuarioDTO usuario = usuarioClient.buscarUsuario(idAdmin);
        if (usuario == null || !usuario.getActivo() || !usuario.getRol().equals("Admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acceso denegado. Esta acción es exclusiva para Administradores.");
        }
    }

    private void validarPermiso(Cita cita, UsuarioDTO usuario, String nuevoEstado) {
        String rol = usuario.getRol();
        if (rol.equals("Admin")) {
            return;
        }
        if (rol.equals("Nutricionista")) {
            NutricionistaDTO nutricionista = usuarioClient.buscarNutricionistaPorUsuario(usuario.getId());
            if (nutricionista != null && nutricionista.getId().equals(cita.getIdNutricionista())) {
                return;
            }
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes modificar tus propias atenciones.");
        }
        if (!cita.getIdPaciente().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes modificar tus propias citas.");
        }
        if (!nuevoEstado.equals(CANCELADA)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Un paciente solo puede cancelar sus citas.");
        }
    }

    private CitaDTO aDTO(Cita c) {
        CitaDTO dto = new CitaDTO();
        dto.setId(c.getId());
        dto.setIdPaciente(c.getIdPaciente());
        dto.setIdNutricionista(c.getIdNutricionista());
        dto.setIdServicio(c.getIdServicio());
        dto.setFecha(c.getFecha());
        dto.setHora(c.getHora());
        dto.setMotivo(c.getMotivo());
        dto.setPrecio(c.getPrecio());
        dto.setEstado(c.getEstado());

        UsuarioDTO paciente = usuarioClient.buscarUsuario(c.getIdPaciente());
        if (paciente != null) {
            dto.setNombrePaciente(paciente.getNombre());
            dto.setRutPaciente(paciente.getRut());
        }
        NutricionistaDTO nutricionista = usuarioClient.buscarNutricionista(c.getIdNutricionista());
        if (nutricionista != null) {
            dto.setNombreNutricionista(nutricionista.getNombre());
        }
        ServicioDTO servicio = contenidoClient.buscarServicio(c.getIdServicio());
        if (servicio != null) {
            dto.setNombreServicio(servicio.getTitulo());
        }
        return dto;
    }
}
