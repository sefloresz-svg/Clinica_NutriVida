package cl.nutrivida.atenciones.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class CitaDTO {
    private Long id;
    private Long idPaciente;
    private String nombrePaciente;
    private String rutPaciente;
    private Long idNutricionista;
    private String nombreNutricionista;
    private Long idServicio;
    private String nombreServicio;
    private LocalDate fecha;
    private LocalTime hora;
    private String motivo;
    private Integer precio;
    private String estado;
}
