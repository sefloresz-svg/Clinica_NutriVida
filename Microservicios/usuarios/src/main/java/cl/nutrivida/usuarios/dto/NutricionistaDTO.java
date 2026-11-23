package cl.nutrivida.usuarios.dto;

import lombok.Data;

// Respuesta con el nombre ya resuelto desde el usuario
@Data
public class NutricionistaDTO {
    private Long id;
    private Long idUsuario;
    private String nombre;
    private String correo;
    private String especialidad;
    private String fotoUrl;
    private Boolean activo;
}
