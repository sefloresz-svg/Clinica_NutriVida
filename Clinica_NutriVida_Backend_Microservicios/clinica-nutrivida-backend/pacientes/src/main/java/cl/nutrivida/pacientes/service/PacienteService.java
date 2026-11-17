package cl.nutrivida.pacientes.service;

import cl.nutrivida.pacientes.model.Paciente;
import cl.nutrivida.pacientes.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PacienteService {
    private final PacienteRepository repository;

    public PacienteService(PacienteRepository repository) {
        this.repository = repository;
    }

    public List<Paciente> listar() {
        return repository.findAll();
    }

    public Paciente obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con id: " + id));
    }

    public Paciente guardar(Paciente entidad) {
        entidad.setId(null);
        return repository.save(entidad);
    }

    public Paciente actualizar(Long id, Paciente datos) {
        Paciente actual = obtenerPorId(id);
        actual.setNombre(datos.getNombre());
        actual.setRut(datos.getRut());
        actual.setCorreo(datos.getCorreo());
        actual.setTelefono(datos.getTelefono());
        actual.setFechaNacimiento(datos.getFechaNacimiento());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Paciente actual = obtenerPorId(id);
        repository.delete(actual);
    }
}
