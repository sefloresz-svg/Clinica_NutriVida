package cl.nutrivida.usuarios.service;

import cl.nutrivida.usuarios.dto.LoginDTO;
import cl.nutrivida.usuarios.dto.RegistroDTO;
import cl.nutrivida.usuarios.dto.ResumenUsuariosDTO;
import cl.nutrivida.usuarios.dto.RolDTO;
import cl.nutrivida.usuarios.dto.UsuarioCrearDTO;
import cl.nutrivida.usuarios.dto.UsuarioDTO;
import cl.nutrivida.usuarios.model.Usuario;
import cl.nutrivida.usuarios.repository.NutricionistaRepository;
import cl.nutrivida.usuarios.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final NutricionistaRepository nutricionistaRepository;
    private final BCryptPasswordEncoder encoder;

    // Mensaje que se repite al crear o cambiar el rol a Nutricionista
    private static final String MENSAJE_CREAR_NUTRICIONISTA =
            "Para crear un nutricionista use la página Nutricionistas.";

    // Inyeccion por constructor (sin @Autowired)
    public UsuarioService(UsuarioRepository usuarioRepository,
                          NutricionistaRepository nutricionistaRepository,
                          BCryptPasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.nutricionistaRepository = nutricionistaRepository;
        this.encoder = encoder;
    }

    // Registro publico: el rol SIEMPRE es Paciente, aunque el front mande otro
    public UsuarioDTO registrar(RegistroDTO dto) {
        String correo = dto.getCorreo().trim().toLowerCase();
        String rut = dto.getRut().trim().toUpperCase();

        validarRut(rut);
        validarCorreoNoRepetido(correo);
        validarRutNoRepetido(rut);

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre().trim());
        usuario.setRut(rut);
        usuario.setCorreo(correo);
        usuario.setContrasena(encoder.encode(dto.getContrasena()));
        usuario.setRol("Paciente");

        return aDTO(usuarioRepository.save(usuario));
    }

    // Login: mismo mensaje si falla el correo o la contrasena (asi no damos pistas)
    public UsuarioDTO login(LoginDTO dto) {
        String correo = dto.getCorreo().trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElse(null);

        if (usuario == null || !encoder.matches(dto.getContrasena(), usuario.getContrasena())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
        }
        if (!usuario.getActivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Tu cuenta está desactivada. Contacta al administrador.");
        }
        return aDTO(usuario);
    }

    // Listado del panel de administracion
    public List<UsuarioDTO> listar(Long idAdmin) {
        validarAdmin(idAdmin);
        List<UsuarioDTO> lista = new ArrayList<>();
        for (Usuario u : usuarioRepository.findAll()) {
            lista.add(aDTO(u));
        }
        return lista;
    }

    // Lo usan los otros microservicios para validar el idUsuario
    public UsuarioDTO buscarPorId(Long id) {
        return aDTO(obtener(id));
    }

    // "+ Crear Usuario" del Admin: aqui se elige entre Paciente y Admin
    public UsuarioDTO crear(UsuarioCrearDTO dto, Long idAdmin) {
        validarAdmin(idAdmin);
        String correo = dto.getCorreo().trim().toLowerCase();
        validarRol(dto.getRol());
        // Un nutricionista necesita tambien su perfil (tabla nutricionista).
        // Por eso se crea solo con POST /api/nutricionistas, que hace las dos cosas juntas
        if (dto.getRol().equals("Nutricionista")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, MENSAJE_CREAR_NUTRICIONISTA);
        }
        validarCorreoNoRepetido(correo);

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre().trim());
        usuario.setCorreo(correo);
        usuario.setContrasena(encoder.encode(dto.getContrasena()));
        usuario.setRol(dto.getRol());

        // El RUT es opcional, pero si viene debe ser valido y no repetido
        if (dto.getRut() != null && !dto.getRut().trim().isEmpty()) {
            String rut = dto.getRut().trim().toUpperCase();
            validarRut(rut);
            validarRutNoRepetido(rut);
            usuario.setRut(rut);
        }
        return aDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO cambiarRol(Long id, RolDTO dto, Long idAdmin) {
        validarAdmin(idAdmin);
        validarRol(dto.getRol());
        if (id.equals(idAdmin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes cambiar tu propio rol.");
        }
        // Si pasara a Nutricionista quedaria sin perfil (no saldria en el equipo ni tendria horarios)
        if (dto.getRol().equals("Nutricionista")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, MENSAJE_CREAR_NUTRICIONISTA);
        }
        Usuario usuario = obtener(id);
        // Si un nutricionista dejara de serlo, su perfil seguiria activo en el equipo
        if (usuario.getRol().equals("Nutricionista")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El rol de un nutricionista no se puede cambiar. Si ya no trabaja en la clínica, "
                            + "elimínelo desde la página Nutricionistas.");
        }
        usuario.setRol(dto.getRol());
        return aDTO(usuarioRepository.save(usuario));
    }

    // Activa o desactiva la cuenta (soft delete)
    public UsuarioDTO cambiarEstado(Long id, Long idAdmin) {
        validarAdmin(idAdmin);
        if (id.equals(idAdmin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No puedes desactivar tu propia cuenta.");
        }
        Usuario usuario = obtener(id);
        usuario.setActivo(!usuario.getActivo());
        return aDTO(usuarioRepository.save(usuario));
    }

    // KPIs del panel de administracion (solo los ve un Admin)
    public ResumenUsuariosDTO resumen(Long idAdmin) {
        validarAdmin(idAdmin);
        ResumenUsuariosDTO dto = new ResumenUsuariosDTO();
        dto.setPacientesActivos(usuarioRepository.countByRolAndActivoTrue("Paciente"));
        dto.setNutricionistasActivos((long) nutricionistaRepository.findByActivoTrueOrderByIdAsc().size());
        return dto;
    }

    // ---------- Metodos de ayuda ----------

    // Revisa que quien hace la peticion sea un Admin activo (es public porque lo usa NutricionistaService)
    public void validarAdmin(Long idAdmin) {
        if (idAdmin == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta el id del administrador.");
        }
        Usuario admin = usuarioRepository.findById(idAdmin).orElse(null);
        if (admin == null || !admin.getActivo() || !admin.getRol().equals("Admin")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acceso denegado. Esta acción es exclusiva para Administradores.");
        }
    }

    public void validarCorreoNoRepetido(String correo) {
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El correo electrónico ya se encuentra registrado.");
        }
    }

    private void validarRutNoRepetido(String rut) {
        if (usuarioRepository.existsByRut(rut)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El RUT ya se encuentra registrado.");
        }
    }

    private void validarRol(String rol) {
        if (!rol.equals("Admin") && !rol.equals("Nutricionista") && !rol.equals("Paciente")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El rol debe ser Admin, Nutricionista o Paciente.");
        }
    }

    // Mismo algoritmo (Modulo 11) que validarRutChileno del front
    private void validarRut(String rut) {
        String mensaje = "El RUT debe ingresarse sin puntos y con guion (ejemplo: 12345678-5). "
                + "Revisa también que el dígito verificador sea el correcto.";

        if (!rut.matches("^\\d{7,8}-[0-9K]$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, mensaje);
        }
        String[] partes = rut.split("-");
        String cuerpo = partes[0];
        String dvIngresado = partes[1];

        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * multiplicador;
            multiplicador = (multiplicador == 7) ? 2 : multiplicador + 1;
        }
        int resultado = 11 - (suma % 11);
        String dvEsperado;
        if (resultado == 11) {
            dvEsperado = "0";
        } else if (resultado == 10) {
            dvEsperado = "K";
        } else {
            dvEsperado = String.valueOf(resultado);
        }
        if (!dvIngresado.equals(dvEsperado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, mensaje);
        }
    }

    private Usuario obtener(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe."));
    }

    // Convierte la entidad a DTO (sin la contrasena)
    private UsuarioDTO aDTO(Usuario u) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(u.getId());
        dto.setNombre(u.getNombre());
        dto.setRut(u.getRut());
        dto.setCorreo(u.getCorreo());
        dto.setRol(u.getRol());
        dto.setActivo(u.getActivo());
        return dto;
    }
}
