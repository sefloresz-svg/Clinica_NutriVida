package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada del boton "Editar" de la pagina del equipo
@Data
public class NutricionistaEditarDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "La especialidad es obligatoria.")
    @Size(max = 150, message = "La especialidad no puede superar los 150 caracteres.")
    private String especialidad;

    @Size(max = 500, message = "La URL de la foto no puede superar los 500 caracteres.")
    private String fotoUrl;
}
