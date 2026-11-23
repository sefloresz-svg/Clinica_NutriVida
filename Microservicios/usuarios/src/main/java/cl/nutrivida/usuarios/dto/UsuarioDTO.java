package cl.nutrivida.usuarios.dto;

import lombok.Data;

// Respuesta con los datos del usuario. La contrasena NUNCA se envia
@Data
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String rut;
    private String correo;
    private String rol;
    private Boolean activo;
}
