package cl.nutrivida.usuarios.controller;

import cl.nutrivida.usuarios.dto.NutricionistaCrearDTO;
import cl.nutrivida.usuarios.dto.NutricionistaDTO;
import cl.nutrivida.usuarios.dto.NutricionistaEditarDTO;
import cl.nutrivida.usuarios.service.NutricionistaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nutricionistas")
public class NutricionistaController {

    private final NutricionistaService nutricionistaService;

    public NutricionistaController(NutricionistaService nutricionistaService) {
        this.nutricionistaService = nutricionistaService;
    }

    @GetMapping
    public ResponseEntity<List<NutricionistaDTO>> listar() {
        return ResponseEntity.ok(nutricionistaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NutricionistaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(nutricionistaService.buscarPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<NutricionistaDTO> buscarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(nutricionistaService.buscarPorUsuario(idUsuario));
    }

    // POST /api/nutricionistas?idAdmin=1
    @PostMapping
    public ResponseEntity<NutricionistaDTO> crear(@Valid @RequestBody NutricionistaCrearDTO dto,
                                                  @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nutricionistaService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NutricionistaDTO> editar(@PathVariable Long id, @Valid @RequestBody NutricionistaEditarDTO dto,
                                                   @RequestParam Long idAdmin) {
        return ResponseEntity.ok(nutricionistaService.editar(id, dto, idAdmin));
    }

    // Soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long idAdmin) {
        nutricionistaService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
