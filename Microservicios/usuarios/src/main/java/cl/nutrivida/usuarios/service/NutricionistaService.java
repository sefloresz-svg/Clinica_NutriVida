package cl.nutrivida.usuarios.service;

import cl.nutrivida.usuarios.dto.NutricionistaCrearDTO;
import cl.nutrivida.usuarios.dto.NutricionistaDTO;
import cl.nutrivida.usuarios.dto.NutricionistaEditarDTO;
import cl.nutrivida.usuarios.model.Nutricionista;
import cl.nutrivida.usuarios.model.Usuario;
import cl.nutrivida.usuarios.repository.NutricionistaRepository;
import cl.nutrivida.usuarios.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class NutricionistaService {

    private final NutricionistaRepository nutricionistaRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioService usuarioService;
    private final BCryptPasswordEncoder encoder;

    public NutricionistaService(NutricionistaRepository nutricionistaRepository,
                                UsuarioRepository usuarioRepository,
                                UsuarioService usuarioService,
                                BCryptPasswordEncoder encoder) {
        this.nutricionistaRepository = nutricionistaRepository;
        this.usuarioRepository = usuarioRepository;
        this.usuarioService = usuarioService;
        this.encoder = encoder;
    }

    // Pagina "Nuestro Equipo": solo los activos
    public List<NutricionistaDTO> listar() {
        List<NutricionistaDTO> lista = new ArrayList<>();
        for (Nutricionista n : nutricionistaRepository.findByActivoTrueOrderByIdAsc()) {
            lista.add(aDTO(n));
        }
        return lista;
    }

    // Lo usa el microservicio atenciones (devuelve tambien los inactivos, con activo=false)
    public NutricionistaDTO buscarPorId(Long id) {
        return aDTO(obtener(id));
    }

    // Cuando un nutricionista inicia sesion, se necesita saber cual es su perfil
    public NutricionistaDTO buscarPorUsuario(Long idUsuario) {
        Nutricionista n = nutricionistaRepository.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El usuario no tiene un perfil de nutricionista."));
        return aDTO(n);
    }

    // Crea la cuenta (rol Nutricionista) y el perfil. @Transactional: se guardan los dos o ninguno
    @Transactional
    public NutricionistaDTO crear(NutricionistaCrearDTO dto, Long idAdmin) {
        usuarioService.validarAdmin(idAdmin);
        String correo = dto.getCorreo().trim().toLowerCase();
        usuarioService.validarCorreoNoRepetido(correo);

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre().trim());
        usuario.setCorreo(correo);
        usuario.setContrasena(encoder.encode(dto.getContrasena()));
        usuario.setRol("Nutricionista");
        usuario = usuarioRepository.save(usuario);

        Nutricionista n = new Nutricionista();
        n.setUsuario(usuario);
        n.setEspecialidad(dto.getEspecialidad().trim());
        n.setFotoUrl(textoOpcional(dto.getFotoUrl()));
        return aDTO(nutricionistaRepository.save(n));
    }

    @Transactional
    public NutricionistaDTO editar(Long id, NutricionistaEditarDTO dto, Long idAdmin) {
        usuarioService.validarAdmin(idAdmin);
        Nutricionista n = obtener(id);
        if (!n.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede editar un nutricionista eliminado.");
        }
        // El nombre se cambia en el usuario, porque ahi vive (3FN)
        n.getUsuario().setNombre(dto.getNombre().trim());
        n.setEspecialidad(dto.getEspecialidad().trim());
        n.setFotoUrl(textoOpcional(dto.getFotoUrl()));
        usuarioRepository.save(n.getUsuario());
        return aDTO(nutricionistaRepository.save(n));
    }

    // Soft delete: se desactiva el perfil y su cuenta. Sus citas antiguas se conservan
    @Transactional
    public void eliminar(Long id, Long idAdmin) {
        usuarioService.validarAdmin(idAdmin);
        Nutricionista n = obtener(id);
        if (!n.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nutricionista ya fue eliminado.");
        }
        n.setActivo(false);
        n.getUsuario().setActivo(false);
        usuarioRepository.save(n.getUsuario());
        nutricionistaRepository.save(n);
    }

    // ---------- Metodos de ayuda ----------

    private Nutricionista obtener(Long id) {
        return nutricionistaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El nutricionista no existe."));
    }

    // Un texto vacio se guarda como null
    private String textoOpcional(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }
        return texto.trim();
    }

    private NutricionistaDTO aDTO(Nutricionista n) {
        NutricionistaDTO dto = new NutricionistaDTO();
        dto.setId(n.getId());
        dto.setIdUsuario(n.getUsuario().getId());
        dto.setNombre(n.getUsuario().getNombre());
        dto.setCorreo(n.getUsuario().getCorreo());
        dto.setEspecialidad(n.getEspecialidad());
        dto.setFotoUrl(n.getFotoUrl());
        dto.setActivo(n.getActivo());
        return dto;
    }
}
