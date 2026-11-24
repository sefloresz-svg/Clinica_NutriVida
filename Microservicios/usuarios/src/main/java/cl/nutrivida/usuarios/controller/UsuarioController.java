package cl.nutrivida.usuarios.controller;

import cl.nutrivida.usuarios.dto.LoginDTO;
import cl.nutrivida.usuarios.dto.RegistroDTO;
import cl.nutrivida.usuarios.dto.ResumenUsuariosDTO;
import cl.nutrivida.usuarios.dto.RolDTO;
import cl.nutrivida.usuarios.dto.SesionDTO;
import cl.nutrivida.usuarios.dto.UsuarioCrearDTO;
import cl.nutrivida.usuarios.dto.UsuarioDTO;
import cl.nutrivida.usuarios.service.UsuarioService;
import cl.nutrivida.usuarios.seguridad.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// El controller solo recibe y responde; la logica esta en el service
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public UsuarioController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    // Registro y login son los unicos endpoints que ENTREGAN el token.
    // Devuelven {token, usuario}; el front guarda los dos en la sesion.
    @PostMapping("/registro")
    public ResponseEntity<SesionDTO> registrar(@Valid @RequestBody RegistroDTO dto) {
        UsuarioDTO usuario = usuarioService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(crearSesion(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<SesionDTO> login(@Valid @RequestBody LoginDTO dto) {
        UsuarioDTO usuario = usuarioService.login(dto);
        return ResponseEntity.ok(crearSesion(usuario));
    }

    private SesionDTO crearSesion(UsuarioDTO usuario) {
        String token = jwtUtil.generarToken(usuario.getId(), usuario.getRol());
        return new SesionDTO(token, usuario);
    }

    // GET /api/usuarios (token de Admin)
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar(HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(usuarioService.listar(idAdmin));
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenUsuariosDTO> resumen(HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(usuarioService.resumen(idAdmin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // POST /api/usuarios (token de Admin)
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioCrearDTO dto, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioDTO> cambiarRol(@PathVariable Long id, @Valid @RequestBody RolDTO dto,
                                                 HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(usuarioService.cambiarRol(id, dto, idAdmin));
    }

    // Activa o desactiva (soft delete)
    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioDTO> cambiarEstado(@PathVariable Long id, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, idAdmin));
    }
}
