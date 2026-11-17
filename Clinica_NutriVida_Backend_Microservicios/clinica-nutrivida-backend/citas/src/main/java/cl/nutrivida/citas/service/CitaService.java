package cl.nutrivida.citas.service;

import cl.nutrivida.citas.model.Cita;
import cl.nutrivida.citas.repository.CitaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CitaService {
    private final CitaRepository repository;

    public CitaService(CitaRepository repository) {
        this.repository = repository;
    }

    public List<Cita> listar() {
        return repository.findAll();
    }

    public Cita obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrado con id: " + id));
    }

    public Cita guardar(Cita entidad) {
        entidad.setId(null);
        return repository.save(entidad);
    }

    public Cita actualizar(Long id, Cita datos) {
        Cita actual = obtenerPorId(id);
        actual.setPacienteId(datos.getPacienteId());
        actual.setNutricionistaId(datos.getNutricionistaId());
        actual.setServicioId(datos.getServicioId());
        actual.setFecha(datos.getFecha());
        actual.setHora(datos.getHora());
        actual.setEstado(datos.getEstado());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Cita actual = obtenerPorId(id);
        repository.delete(actual);
    }
}
