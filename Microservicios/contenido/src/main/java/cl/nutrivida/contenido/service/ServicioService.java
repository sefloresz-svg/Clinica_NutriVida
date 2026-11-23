package cl.nutrivida.contenido.service;

import cl.nutrivida.contenido.dto.ServicioEntradaDTO;
import cl.nutrivida.contenido.model.Servicio;
import cl.nutrivida.contenido.repository.ServicioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final PermisoService permisoService;

    public ServicioService(ServicioRepository servicioRepository, PermisoService permisoService) {
        this.servicioRepository = servicioRepository;
        this.permisoService = permisoService;
    }

    // Catalogo publico: solo activos
    public List<Servicio> listar() {
        return servicioRepository.findByActivoTrueOrderByIdAsc();
    }

    // Lo usa atenciones para validar el servicio y copiar su precio (devuelve tambien inactivos)
    public Servicio buscarPorId(Long id) {
        return obtener(id);
    }

    public Servicio crear(ServicioEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        String codigo = dto.getCodigo().trim().toUpperCase();
        if (servicioRepository.existsByCodigo(codigo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un servicio con el código " + codigo + ".");
        }
        Servicio servicio = new Servicio();
        copiarDatos(dto, servicio);
        return servicioRepository.save(servicio);
    }

    public Servicio editar(Long id, ServicioEntradaDTO dto, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Servicio servicio = obtener(id);
        if (!servicio.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede editar un servicio eliminado.");
        }
        String codigo = dto.getCodigo().trim().toUpperCase();
        if (servicioRepository.existsByCodigoAndIdNot(codigo, id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un servicio con el código " + codigo + ".");
        }
        copiarDatos(dto, servicio);
        return servicioRepository.save(servicio);
    }

    // Soft delete: las citas antiguas siguen mostrando el nombre del servicio
    public void eliminar(Long id, Long idAdmin) {
        permisoService.validarAdmin(idAdmin);
        Servicio servicio = obtener(id);
        if (!servicio.getActivo()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El servicio ya fue eliminado.");
        }
        servicio.setActivo(false);
        servicioRepository.save(servicio);
    }

    // ---------- Metodos de ayuda ----------

    private Servicio obtener(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El servicio no existe."));
    }

    private void copiarDatos(ServicioEntradaDTO dto, Servicio servicio) {
        servicio.setCodigo(dto.getCodigo().trim().toUpperCase());
        servicio.setTitulo(dto.getTitulo().trim());
        servicio.setTipo(dto.getTipo().trim());
        servicio.setDuracion(dto.getDuracion().trim());
        servicio.setModalidad(dto.getModalidad().trim());
        servicio.setPrecio(dto.getPrecio());
    }
}
