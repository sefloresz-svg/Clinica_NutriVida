package cl.nutrivida.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Entrada para cambiar el rol desde el select del panel de administracion
@Data
public class RolDTO {

    @NotBlank(message = "Debe seleccionar un rol.")
    private String rol;
}
