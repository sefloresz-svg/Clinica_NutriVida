package cl.nutrivida.contenido.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada de "+ Agregar Servicio" y "Editar Arancel"
@Data
public class ServicioEntradaDTO {

    @NotBlank(message = "El código es obligatorio.")
    @Size(max = 10, message = "El código no puede superar los 10 caracteres.")
    private String codigo;

    @NotBlank(message = "El título es obligatorio.")
    @Size(max = 100, message = "El título no puede superar los 100 caracteres.")
    private String titulo;

    @NotBlank(message = "El tipo es obligatorio.")
    @Size(max = 30, message = "El tipo no puede superar los 30 caracteres.")
    private String tipo;

    @NotBlank(message = "La duración es obligatoria.")
    @Size(max = 20, message = "La duración no puede superar los 20 caracteres.")
    private String duracion;

    @NotBlank(message = "La modalidad es obligatoria.")
    @Size(max = 20, message = "La modalidad no puede superar los 20 caracteres.")
    private String modalidad;

    @NotNull(message = "El precio es obligatorio.")
    @Min(value = 1, message = "El precio debe ser mayor a 0.")
    @Max(value = 10000000, message = "El precio no puede superar los $10.000.000.")
    private Integer precio;
}
