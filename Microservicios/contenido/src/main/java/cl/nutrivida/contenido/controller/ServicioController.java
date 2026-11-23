package cl.nutrivida.contenido.controller;

import cl.nutrivida.contenido.dto.ServicioEntradaDTO;
import cl.nutrivida.contenido.model.Servicio;
import cl.nutrivida.contenido.service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public ResponseEntity<List<Servicio>> listar() {
        return ResponseEntity.ok(servicioService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.buscarPorId(id));
    }

    // POST /api/servicios?idAdmin=1
    @PostMapping
    public ResponseEntity<Servicio> crear(@Valid @RequestBody ServicioEntradaDTO dto, @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> editar(@PathVariable Long id, @Valid @RequestBody ServicioEntradaDTO dto,
                                           @RequestParam Long idAdmin) {
        return ResponseEntity.ok(servicioService.editar(id, dto, idAdmin));
    }

    // Soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long idAdmin) {
        servicioService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
