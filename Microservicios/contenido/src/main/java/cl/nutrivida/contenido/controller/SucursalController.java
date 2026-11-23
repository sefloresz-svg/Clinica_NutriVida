package cl.nutrivida.contenido.controller;

import cl.nutrivida.contenido.dto.SucursalEntradaDTO;
import cl.nutrivida.contenido.model.Sucursal;
import cl.nutrivida.contenido.service.SucursalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales")
public class SucursalController {

    private final SucursalService sucursalService;

    public SucursalController(SucursalService sucursalService) {
        this.sucursalService = sucursalService;
    }

    @GetMapping
    public ResponseEntity<List<Sucursal>> listar() {
        return ResponseEntity.ok(sucursalService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sucursal> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(sucursalService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Sucursal> crear(@Valid @RequestBody SucursalEntradaDTO dto, @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sucursalService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> editar(@PathVariable Long id, @Valid @RequestBody SucursalEntradaDTO dto,
                                           @RequestParam Long idAdmin) {
        return ResponseEntity.ok(sucursalService.editar(id, dto, idAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long idAdmin) {
        sucursalService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
