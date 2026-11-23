package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada del boton "+ Agregar Nutricionista": crea su cuenta y su perfil a la vez
@Data
public class NutricionistaCrearDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo electrónico no es válido.")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String contrasena;

    @NotBlank(message = "La especialidad es obligatoria.")
    @Size(max = 150, message = "La especialidad no puede superar los 150 caracteres.")
    private String especialidad;

    @Size(max = 500, message = "La URL de la foto no puede superar los 500 caracteres.")
    private String fotoUrl;
}
