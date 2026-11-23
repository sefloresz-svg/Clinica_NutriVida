package cl.nutrivida.atenciones.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CitaEntradaDTO {

    @NotNull(message = "Debes iniciar sesión para agendar una hora de atención.")
    private Long idPaciente;

    @NotNull(message = "Por favor, seleccione un servicio nutricional.")
    private Long idServicio;

    @NotNull(message = "Por favor, seleccione un nutricionista.")
    private Long idNutricionista;

    @NotNull(message = "Por favor, seleccione una fecha de atención.")
    private LocalDate fecha;

    @NotNull(message = "Por favor, seleccione una hora disponible.")
    private LocalTime hora;

    @Size(max = 500, message = "El motivo no puede superar los 500 caracteres.")
    private String motivo;
}
