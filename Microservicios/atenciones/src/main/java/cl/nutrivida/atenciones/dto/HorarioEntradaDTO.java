package cl.nutrivida.atenciones.dto;

import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HorarioEntradaDTO {

    @NotNull(message = "Debe indicar el nutricionista.")
    private Long idNutricionista;

    @NotNull(message = "Debe indicar la hora del bloque.")
    private LocalTime hora;
}
