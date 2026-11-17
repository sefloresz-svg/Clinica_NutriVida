package cl.nutrivida.servicios.service;

import cl.nutrivida.servicios.model.Servicio;
import cl.nutrivida.servicios.repository.ServicioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServicioService {
    private final ServicioRepository repository;

    public ServicioService(ServicioRepository repository) {
        this.repository = repository;
    }

    public List<Servicio> listar() {
        return repository.findAll();
    }

    public Servicio obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con id: " + id));
    }

    public Servicio guardar(Servicio entidad) {
        entidad.setId(null);
        return repository.save(entidad);
    }

    public Servicio actualizar(Long id, Servicio datos) {
        Servicio actual = obtenerPorId(id);
        actual.setCodigo(datos.getCodigo());
        actual.setNombre(datos.getNombre());
        actual.setDescripcion(datos.getDescripcion());
        actual.setDuracionMinutos(datos.getDuracionMinutos());
        actual.setModalidad(datos.getModalidad());
        actual.setPrecio(datos.getPrecio());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Servicio actual = obtenerPorId(id);
        repository.delete(actual);
    }
}
