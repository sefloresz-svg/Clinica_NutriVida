package cl.nutrivida.usuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// Respuesta del login y del registro: el token JWT + los datos del usuario (sin contrasena)
@Data
@AllArgsConstructor
public class SesionDTO {
    private String token;
    private UsuarioDTO usuario;
}
