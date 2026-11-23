package cl.nutrivida.atenciones.dto;

import lombok.Data;

@Data
public class ServicioDTO {
    private Long id;
    private String titulo;
    private Integer precio;
    private Boolean activo;
}