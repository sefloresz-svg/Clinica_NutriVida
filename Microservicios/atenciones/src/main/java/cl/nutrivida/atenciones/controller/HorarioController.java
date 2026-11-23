package cl.nutrivida.atenciones.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.nutrivida.atenciones.dto.HorarioEntradaDTO;
import cl.nutrivida.atenciones.model.HorarioNutricionista;
import cl.nutrivida.atenciones.service.HorarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping("/nutricionista/{idNutricionista}")
    public ResponseEntity<List<HorarioNutricionista>> listar(@PathVariable Long idNutricionista) {
        return ResponseEntity.ok(horarioService.listar(idNutricionista));
    }

    @PostMapping
    public ResponseEntity<HorarioNutricionista> crear(@Valid @RequestBody HorarioEntradaDTO dto,
                                                      @RequestParam Long idAdmin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioService.crear(dto, idAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long idAdmin) {
        horarioService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
