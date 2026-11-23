package cl.nutrivida.atenciones.dto;

import lombok.Data;

@Data
public class NutricionistaDTO {
    private Long id;
    private Long idUsuario;
    private String nombre;
    private Boolean activo;
}
