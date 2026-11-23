package cl.nutrivida.atenciones.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FichaEntradaDTO {

    @NotNull(message = "El peso es obligatorio.")
    @Min(value = 1, message = "El peso debe ser mayor a 0 kg.")
    @Max(value = 400, message = "El peso no puede superar los 400 kg.")
    private BigDecimal pesoKg;

    @NotNull(message = "La estatura es obligatoria.")
    @DecimalMin(value = "0.50", message = "La estatura debe estar entre 0.50 y 2.50 metros.")
    @DecimalMax(value = "2.50", message = "La estatura debe estar entre 0.50 y 2.50 metros.")
    private BigDecimal estaturaM;

    @NotBlank(message = "El diagnóstico es obligatorio.")
    @Size(max = 5000, message = "El diagnóstico no puede superar los 5000 caracteres.")
    private String diagnostico;
}
