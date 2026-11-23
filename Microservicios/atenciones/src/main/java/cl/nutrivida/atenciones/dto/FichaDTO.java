package cl.nutrivida.atenciones.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FichaDTO {
    private Long id;
    private Long idPaciente;
    private String nombrePaciente;
    private String rutPaciente;
    private BigDecimal pesoKg;
    private BigDecimal estaturaM;
    private String diagnostico;
    private LocalDateTime fechaActualizacion;
}
