package cl.nutrivida.atenciones.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import cl.nutrivida.atenciones.client.UsuarioClient;
import cl.nutrivida.atenciones.dto.HorarioEntradaDTO;
import cl.nutrivida.atenciones.dto.NutricionistaDTO;
import cl.nutrivida.atenciones.dto.UsuarioDTO;
import cl.nutrivida.atenciones.model.HorarioNutricionista;
import cl.nutrivida.atenciones.repository.HorarioNutricionistaRepository;

@Service
public class HorarioService {

    private final HorarioNutricionistaRepository horarioRepository;
    private final UsuarioClient usuarioClient;

    public HorarioService(HorarioNutricionistaRepository horarioRepository, UsuarioClient usuarioClient) {
        this.horarioRepository = horarioRepository;
        this.usuarioClient = usuarioClient;
    }

    public List<HorarioNutricionista> listar(Long idNutricionista) {
        return horarioRepository.findByIdNutricionistaOrderByHoraAsc(idNutricionista);
    }

    public HorarioNutricionista crear(HorarioEntradaDTO dto, Long idAdmin) {
        validarAdmin(idAdmin);

        NutricionistaDTO nutricionista = usuarioClient.buscarNutricionista(dto.getIdNutricionista());
        if (nutricionista == null || !nutricionista.getActivo()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El nutricionista no existe o no está activo.");
        }
        if (horarioRepository.existsByIdNutricionistaAndHora(dto.getIdNutricionista(), dto.getHora())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nutricionista ya tiene ese bloque horario.");
        }
        HorarioNutricionista horario = new HorarioNutricionista();
        horario.setIdNutricionista(dto.getIdNutricionista());
        horario.setHora(dto.getHora());
        return horarioRepository.save(horario);
    }

    public void eliminar(Long id, Long idAdmin) {
        validarAdmin(idAdmin);
        HorarioNutricionista horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El bloque horario no existe."));
        horarioRepository.delete(horario);
    }

    private void validarAdmin(Long idAdmin) {
        UsuarioDTO usuario = usuarioClient.buscarUsuario(idAdmin);
        if (usuario == null || !usuario.getActivo() || !usuario.getRol().equals("Admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acceso denegado. Esta acción es exclusiva para Administradores.");
        }
    }
}
