package cl.nutrivida.atenciones.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.nutrivida.atenciones.dto.CitaDTO;
import cl.nutrivida.atenciones.dto.CitaEntradaDTO;
import cl.nutrivida.atenciones.dto.EstadoDTO;
import cl.nutrivida.atenciones.dto.ResumenCitasDTO;
import cl.nutrivida.atenciones.service.CitaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public ResponseEntity<List<CitaDTO>> listar(@RequestParam Long idUsuario) {
        return ResponseEntity.ok(citaService.listar(idUsuario));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<LocalTime>> disponibles(@RequestParam Long idNutricionista,
                                                       @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.horasDisponibles(idNutricionista, fecha));
    }

    @GetMapping("/resumen")
    public ResponseEntity<ResumenCitasDTO> resumen(@RequestParam Long idAdmin) {
        return ResponseEntity.ok(citaService.resumen(idAdmin));
    }

    @PostMapping
    public ResponseEntity<CitaDTO> crear(@Valid @RequestBody CitaEntradaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crear(dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<CitaDTO> cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoDTO dto,
                                                 @RequestParam Long idUsuario) {
        return ResponseEntity.ok(citaService.cambiarEstado(id, dto, idUsuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id, @RequestParam Long idUsuario) {
        citaService.cancelar(id, idUsuario);
        return ResponseEntity.noContent().build();
    }
}
