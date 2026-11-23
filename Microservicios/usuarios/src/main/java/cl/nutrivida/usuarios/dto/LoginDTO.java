package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Entrada del formulario de inicio de sesion
@Data
public class LoginDTO {

    @NotBlank(message = "Por favor, ingrese su correo y contraseña.")
    private String correo;

    @NotBlank(message = "Por favor, ingrese su correo y contraseña.")
    private String contrasena;
}
