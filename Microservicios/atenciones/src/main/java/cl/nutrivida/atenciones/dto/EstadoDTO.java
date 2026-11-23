package cl.nutrivida.atenciones.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EstadoDTO {

    @NotBlank(message = "Debe indicar el nuevo estado.")
    private String estado;
}
