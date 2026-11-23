package cl.nutrivida.contenido.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

// Articulos y consejos (pagina Novedades)
@Data
@Entity
@Table(name = "novedad")
public class Novedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_novedad")
    private Long id;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "categoria", nullable = false, length = 50)
    private String categoria;

    @Column(name = "resumen", nullable = false, length = 500)
    private String resumen;

    // TEXT porque el articulo completo puede ser largo
    @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDate fechaPublicacion;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    // La fecha de publicacion se pone sola al guardar por primera vez
    @PrePersist
    public void prePersist() {
        this.fechaPublicacion = LocalDate.now();
    }
}
