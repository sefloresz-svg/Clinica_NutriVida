package cl.nutrivida.contenido.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada de "+ Agregar Sucursal" y "Editar"
@Data
public class SucursalEntradaDTO {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "El sector es obligatorio.")
    @Size(max = 100, message = "El sector no puede superar los 100 caracteres.")
    private String sector;

    @NotBlank(message = "La dirección es obligatoria.")
    @Size(max = 200, message = "La dirección no puede superar los 200 caracteres.")
    private String direccion;

    @NotBlank(message = "El teléfono es obligatorio.")
    @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres.")
    private String telefono;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo electrónico no es válido.")
    @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
    private String correo;

    @NotBlank(message = "El horario es obligatorio.")
    @Size(max = 255, message = "El horario no puede superar los 255 caracteres.")
    private String horario;

    @Size(max = 1000, message = "La URL del mapa no puede superar los 1000 caracteres.")
    private String mapaUrl;
}
