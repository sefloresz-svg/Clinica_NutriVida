package cl.nutrivida.nutricionistas.controller;

import cl.nutrivida.nutricionistas.model.Nutricionista;
import cl.nutrivida.nutricionistas.service.NutricionistaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nutricionistas")
@CrossOrigin(origins = "http://localhost:5173")
public class NutricionistaController {
    private final NutricionistaService service;

    public NutricionistaController(NutricionistaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Nutricionista>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/<built-in function id>")
    public ResponseEntity<Nutricionista> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Nutricionista> crear(@Valid @RequestBody Nutricionista entidad) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(entidad));
    }

    @PutMapping("/<built-in function id>")
    public ResponseEntity<Nutricionista> actualizar(@PathVariable Long id, @Valid @RequestBody Nutricionista entidad) {
        return ResponseEntity.ok(service.actualizar(id, entidad));
    }

    @DeleteMapping("/<built-in function id>")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
