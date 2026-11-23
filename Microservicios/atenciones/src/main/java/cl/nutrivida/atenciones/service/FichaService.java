package cl.nutrivida.atenciones.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.nutrivida.atenciones.client.UsuarioClient;
import cl.nutrivida.atenciones.dto.FichaDTO;
import cl.nutrivida.atenciones.dto.FichaEntradaDTO;
import cl.nutrivida.atenciones.dto.UsuarioDTO;
import cl.nutrivida.atenciones.model.FichaClinica;
import cl.nutrivida.atenciones.repository.FichaClinicaRepository;

@Service
public class FichaService {

    private final FichaClinicaRepository fichaRepository;
    private final UsuarioClient usuarioClient;

    public FichaService(FichaClinicaRepository fichaRepository, UsuarioClient usuarioClient) {
        this.fichaRepository = fichaRepository;
        this.usuarioClient = usuarioClient;
    }

    public FichaDTO obtener(Long idPaciente, Long idUsuario) {
        UsuarioDTO usuario = obtenerUsuarioActivo(idUsuario);
        if (!usuario.getRol().equals("Admin") && !usuario.getRol().equals("Nutricionista")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo el personal de la clínica puede ver las fichas clínicas.");
        }
        UsuarioDTO paciente = validarPaciente(idPaciente);
        FichaClinica ficha = fichaRepository.findByIdPaciente(idPaciente).orElse(null);
        return aDTO(ficha, paciente);
    }

    public FichaDTO guardar(Long idPaciente, FichaEntradaDTO dto, Long idUsuario) {
        UsuarioDTO usuario = obtenerUsuarioActivo(idUsuario);
        if (!usuario.getRol().equals("Nutricionista")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Solo un nutricionista puede modificar la ficha clínica.");
        }
        UsuarioDTO paciente = validarPaciente(idPaciente);

        FichaClinica ficha = fichaRepository.findByIdPaciente(idPaciente).orElse(null);
        if (ficha == null) {
            ficha = new FichaClinica();
            ficha.setIdPaciente(idPaciente);
        }
        ficha.setPesoKg(dto.getPesoKg());
        ficha.setEstaturaM(dto.getEstaturaM());
        ficha.setDiagnostico(dto.getDiagnostico().trim());
        return aDTO(fichaRepository.save(ficha), paciente);
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
        UsuarioDTO paciente = usuarioClient.buscarUsuario(idPaciente);
        if (paciente == null || !paciente.getRol().equals("Paciente")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El paciente no existe.");
        }
        return paciente;
    }

    private FichaDTO aDTO(FichaClinica ficha, UsuarioDTO paciente) {
        FichaDTO dto = new FichaDTO();
        dto.setIdPaciente(paciente.getId());
        dto.setNombrePaciente(paciente.getNombre());
        dto.setRutPaciente(paciente.getRut());
        if (ficha != null) {
            dto.setId(ficha.getId());
            dto.setPesoKg(ficha.getPesoKg());
            dto.setEstaturaM(ficha.getEstaturaM());
            dto.setDiagnostico(ficha.getDiagnostico());
            dto.setFechaActualizacion(ficha.getFechaActualizacion());
        }
        return dto;
    }
}
