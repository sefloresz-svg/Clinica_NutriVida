package cl.nutrivida.nutricionistas.service;

import cl.nutrivida.nutricionistas.model.Nutricionista;
import cl.nutrivida.nutricionistas.repository.NutricionistaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NutricionistaService {
    private final NutricionistaRepository repository;

    public NutricionistaService(NutricionistaRepository repository) {
        this.repository = repository;
    }

    public List<Nutricionista> listar() {
        return repository.findAll();
    }

    public Nutricionista obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nutricionista no encontrado con id: " + id));
    }

    public Nutricionista guardar(Nutricionista entidad) {
        entidad.setId(null);
        return repository.save(entidad);
    }

    public Nutricionista actualizar(Long id, Nutricionista datos) {
        Nutricionista actual = obtenerPorId(id);
        actual.setNombre(datos.getNombre());
        actual.setCorreo(datos.getCorreo());
        actual.setEspecialidad(datos.getEspecialidad());
        actual.setTelefono(datos.getTelefono());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        Nutricionista actual = obtenerPorId(id);
        repository.delete(actual);
    }
}
