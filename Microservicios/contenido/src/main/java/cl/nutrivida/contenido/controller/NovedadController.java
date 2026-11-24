package cl.nutrivida.contenido.controller;

import cl.nutrivida.contenido.dto.NovedadEntradaDTO;
import cl.nutrivida.contenido.model.Novedad;
import cl.nutrivida.contenido.service.NovedadService;
import cl.nutrivida.contenido.seguridad.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/novedades")
public class NovedadController {

    private final NovedadService novedadService;
    private final JwtUtil jwtUtil;

    public NovedadController(NovedadService novedadService, JwtUtil jwtUtil) {
        this.novedadService = novedadService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Novedad>> listar() {
        return ResponseEntity.ok(novedadService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Novedad> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(novedadService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Novedad> crear(@Valid @RequestBody NovedadEntradaDTO dto, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novedadService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Novedad> editar(@PathVariable Long id, @Valid @RequestBody NovedadEntradaDTO dto,
                                          HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(novedadService.editar(id, dto, idAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        novedadService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
