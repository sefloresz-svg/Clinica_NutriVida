package cl.nutrivida.usuarios.controller;

import cl.nutrivida.usuarios.dto.LoginDTO;
import cl.nutrivida.usuarios.dto.RegistroDTO;
import cl.nutrivida.usuarios.dto.ResumenUsuariosDTO;
import cl.nutrivida.usuarios.dto.RolDTO;
import cl.nutrivida.usuarios.dto.UsuarioCrearDTO;
import cl.nutrivida.usuarios.dto.UsuarioDTO;
import cl.nutrivida.usuarios.service.UsuarioService;
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

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioDTO> registrar(@Valid @RequestBody RegistroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioDTO> login(@Valid @RequestBody LoginDTO dto) {
        return ResponseEntity.ok(usuarioService.login(dto));
    }

    // GET /api/usuarios?idAdmin=1
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar(@RequestParam Long idAdmin) {
        return ResponseEntity.ok(usuarioService.listar(idAdmin));
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenUsuariosDTO> resumen(@RequestParam Long idAdmin) {
        return ResponseEntity.ok(usuarioService.resumen(idAdmin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // POST /api/usuarios?idAdmin=1
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioCrearDTO dto, @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<UsuarioDTO> cambiarRol(@PathVariable Long id, @Valid @RequestBody RolDTO dto,
                                                 @RequestParam Long idAdmin) {
        return ResponseEntity.ok(usuarioService.cambiarRol(id, dto, idAdmin));
    }

    // Activa o desactiva (soft delete)
    @PutMapping("/{id}/estado")
    public ResponseEntity<UsuarioDTO> cambiarEstado(@PathVariable Long id, @RequestParam Long idAdmin) {
        return ResponseEntity.ok(usuarioService.cambiarEstado(id, idAdmin));
    }
}
