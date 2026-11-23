package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada del boton "+ Crear Usuario" del panel de administracion
@Data
public class UsuarioCrearDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    // Opcional: el Admin y los nutricionistas pueden no tener RUT
    private String rut;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo electrónico no es válido.")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String contrasena;

    @NotBlank(message = "Debe seleccionar un rol.")
    private String rol;
}
