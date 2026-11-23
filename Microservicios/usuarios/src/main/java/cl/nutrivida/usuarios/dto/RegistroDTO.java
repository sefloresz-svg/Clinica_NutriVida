package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada del formulario "Crear Mi Cuenta" (Login.tsx)
@Data
public class RegistroDTO {

    @NotBlank(message = "Por favor, completa todos los campos del registro.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "Por favor, completa todos los campos del registro.")
    private String rut;

    @NotBlank(message = "Por favor, completa todos los campos del registro.")
    @Email(message = "El correo electrónico no es válido.")
    @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
    private String correo;

    @NotBlank(message = "Por favor, completa todos los campos del registro.")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String contrasena;
}
