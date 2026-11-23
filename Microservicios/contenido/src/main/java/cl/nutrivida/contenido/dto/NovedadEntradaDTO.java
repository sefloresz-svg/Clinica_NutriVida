package cl.nutrivida.contenido.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Entrada de "+ Publicar Novedad" y "Editar Articulo"
@Data
public class NovedadEntradaDTO {

    @NotBlank(message = "El título es obligatorio.")
    @Size(max = 150, message = "El título no puede superar los 150 caracteres.")
    private String titulo;

    @NotBlank(message = "La categoría es obligatoria.")
    @Size(max = 50, message = "La categoría no puede superar los 50 caracteres.")
    private String categoria;

    @NotBlank(message = "El resumen es obligatorio.")
    @Size(max = 500, message = "El resumen no puede superar los 500 caracteres.")
    private String resumen;

    @NotBlank(message = "El contenido del artículo es obligatorio.")
    private String contenido;

    @Size(max = 500, message = "La URL de la imagen no puede superar los 500 caracteres.")
    private String imagenUrl;
}
