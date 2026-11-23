package cl.nutrivida.atenciones.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String rut;
    private String rol;
    private Boolean activo;
}
