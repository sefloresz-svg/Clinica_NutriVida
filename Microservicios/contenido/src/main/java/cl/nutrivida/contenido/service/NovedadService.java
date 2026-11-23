package cl.nutrivida.contenido.service;

import cl.nutrivida.contenido.dto.NovedadEntradaDTO;
import cl.nutrivida.contenido.model.Novedad;
import cl.nutrivida.contenido.repository.NovedadRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NovedadService {

    private final NovedadRepository novedadRepository;
    private final PermisoService permisoService;

    public NovedadService(NovedadRepository novedadRepository, PermisoService permisoService) {
        this.novedadRepository = novedadRepository;
        this.permisoService = permisoService;
    }

    public List<Novedad> listar() {
        return novedadRepository.findAllByOrderByFechaPublicacionDescIdDesc();
    }

    public Novedad buscarPorId(Long id) {
        return obtener(id);
    }

    public Novedad crear(NovedadEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Novedad novedad = new Novedad();
        copiarDatos(dto, novedad);
        return novedadRepository.save(novedad);
    }

    public Novedad editar(Long id, NovedadEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Novedad novedad = obtener(id);
        copiarDatos(dto, novedad);
        return novedadRepository.save(novedad);
    }

    // Borrado real: ninguna otra tabla apunta a una novedad
    public void eliminar(Long id, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        novedadRepository.delete(obtener(id));
    }

    // ---------- Metodos de ayuda ----------

    private Novedad obtener(Long id) {
        return novedadRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La novedad no existe."));
    }

    private void copiarDatos(NovedadEntradaDTO dto, Novedad novedad) {
        novedad.setTitulo(dto.getTitulo().trim());
        novedad.setCategoria(dto.getCategoria().trim());
        novedad.setResumen(dto.getResumen().trim());
        novedad.setContenido(dto.getContenido().trim());
        if (dto.getImagenUrl() == null || dto.getImagenUrl().trim().isEmpty()) {
            novedad.setImagenUrl(null);
        } else {
            novedad.setImagenUrl(dto.getImagenUrl().trim());
        }
    }
}
