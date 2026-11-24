package cl.nutrivida.contenido.controller;

import cl.nutrivida.contenido.dto.SucursalEntradaDTO;
import cl.nutrivida.contenido.model.Sucursal;
import cl.nutrivida.contenido.service.SucursalService;
import cl.nutrivida.contenido.seguridad.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursales")
public class SucursalController {

    private final SucursalService sucursalService;
    private final JwtUtil jwtUtil;

    public SucursalController(SucursalService sucursalService, JwtUtil jwtUtil) {
        this.sucursalService = sucursalService;
        this.jwtUtil = jwtUtil;
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
    public ResponseEntity<Sucursal> crear(@Valid @RequestBody SucursalEntradaDTO dto, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(sucursalService.crear(dto, idAdmin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sucursal> editar(@PathVariable Long id, @Valid @RequestBody SucursalEntradaDTO dto,
                                           HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        return ResponseEntity.ok(sucursalService.editar(id, dto, idAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, HttpServletRequest request) {
        Long idAdmin = jwtUtil.obtenerIdAdmin(request);
        sucursalService.eliminar(id, idAdmin);
        return ResponseEntity.noContent().build();
    }
}
