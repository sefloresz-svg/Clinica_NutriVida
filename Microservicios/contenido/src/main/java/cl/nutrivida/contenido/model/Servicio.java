package cl.nutrivida.contenido.model;

import jakarta.persistence.*;
import lombok.Data;

// Catalogo de consultas y planes (pagina Servicios)
@Data
@Entity
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long id;

    // Ejemplo: CN001
    @Column(name = "codigo", nullable = false, unique = true, length = 10)
    private String codigo;

    @Column(name = "titulo", nullable = false, length = 100)
    private String titulo;

    // Consulta o Plan especializado
    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    // Texto como "50 min" o "1 mes"
    @Column(name = "duracion", nullable = false, length = 20)
    private String duracion;

    @Column(name = "modalidad", nullable = false, length = 20)
    private String modalidad;

    // Pesos chilenos, sin decimales
    @Column(name = "precio", nullable = false)
    private Integer precio;

    // Soft delete: las citas antiguas siguen apuntando a este servicio
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}
