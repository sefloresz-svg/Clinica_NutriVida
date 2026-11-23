package cl.nutrivida.contenido.controller;

import cl.nutrivida.contenido.dto.NovedadEntradaDTO;
import cl.nutrivida.contenido.model.Novedad;
import cl.nutrivida.contenido.service.NovedadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/novedades")
public class NovedadController {

    private final NovedadService novedadService;

    public NovedadController(NovedadService novedadService) {
        this.novedadService = novedadService;
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
    public ResponseEntity<Novedad> crear(@Valid @RequestBody NovedadEntradaDTO dto, @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(novedadService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Novedad> editar(@PathVariable Long id, @Valid @RequestBody NovedadEntradaDTO dto,
                                          @RequestParam Long idAdmin) {
        return ResponseEntity.ok(novedadService.editar(id, dto, idAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long idAdmin) {
        novedadService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
