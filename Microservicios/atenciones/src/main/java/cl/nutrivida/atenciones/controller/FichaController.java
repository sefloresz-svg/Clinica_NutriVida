package cl.nutrivida.atenciones.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.nutrivida.atenciones.dto.FichaDTO;
import cl.nutrivida.atenciones.dto.FichaEntradaDTO;
import cl.nutrivida.atenciones.service.FichaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fichas")
public class FichaController {

    private final FichaService fichaService;

    public FichaController(FichaService fichaService) {
        this.fichaService = fichaService;
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<FichaDTO> obtener(@PathVariable Long idPaciente, @RequestParam Long idUsuario) {
        return ResponseEntity.ok(fichaService.obtener(idPaciente, idUsuario));
    }

    @PutMapping("/paciente/{idPaciente}")
    public ResponseEntity<FichaDTO> guardar(@PathVariable Long idPaciente, @Valid @RequestBody FichaEntradaDTO dto,
                                            @RequestParam Long idUsuario) {
        return ResponseEntity.ok(fichaService.guardar(idPaciente, dto, idUsuario));
    }
}
