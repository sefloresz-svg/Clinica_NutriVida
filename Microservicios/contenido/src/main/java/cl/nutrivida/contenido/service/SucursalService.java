package cl.nutrivida.contenido.service;

import cl.nutrivida.contenido.dto.SucursalEntradaDTO;
import cl.nutrivida.contenido.model.Sucursal;
import cl.nutrivida.contenido.repository.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SucursalService {

    private final SucursalRepository sucursalRepository;
    private final PermisoService permisoService;

    public SucursalService(SucursalRepository sucursalRepository, PermisoService permisoService) {
        this.sucursalRepository = sucursalRepository;
        this.permisoService = permisoService;
    }

    public List<Sucursal> listar() {
        return sucursalRepository.findAllByOrderByIdAsc();
    }

    public Sucursal buscarPorId(Long id) {
        return obtener(id);
    }

    public Sucursal crear(SucursalEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Sucursal sucursal = new Sucursal();
        copiarDatos(dto, sucursal);
        return sucursalRepository.save(sucursal);
    }

    public Sucursal editar(Long id, SucursalEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Sucursal sucursal = obtener(id);
        copiarDatos(dto, sucursal);
        return sucursalRepository.save(sucursal);
    }

    // Borrado real: ninguna otra tabla apunta a una sucursal
    public void eliminar(Long id, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        sucursalRepository.delete(obtener(id));
    }

    // ---------- Metodos de ayuda ----------

    private Sucursal obtener(Long id) {
        return sucursalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La sucursal no existe."));
    }

    private void copiarDatos(SucursalEntradaDTO dto, Sucursal sucursal) {
        sucursal.setNombre(dto.getNombre().trim());
        sucursal.setSector(dto.getSector().trim());
        sucursal.setDireccion(dto.getDireccion().trim());
        sucursal.setTelefono(dto.getTelefono().trim());
        sucursal.setCorreo(dto.getCorreo().trim().toLowerCase());
        sucursal.setHorario(dto.getHorario().trim());
        if (dto.getMapaUrl() == null || dto.getMapaUrl().trim().isEmpty()) {
            sucursal.setMapaUrl(null);
        } else {
            sucursal.setMapaUrl(dto.getMapaUrl().trim());
        }
    }
}
