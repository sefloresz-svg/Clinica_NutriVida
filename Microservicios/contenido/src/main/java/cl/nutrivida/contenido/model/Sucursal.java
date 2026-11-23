package cl.nutrivida.contenido.model;

import jakarta.persistence.*;
import lombok.Data;

// Sedes de la clinica (pagina Nosotros)
@Data
@Entity
@Table(name = "sucursal")
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sucursal")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "sector", nullable = false, length = 100)
    private String sector;

    @Column(name = "direccion", nullable = false, length = 200)
    private String direccion;

    @Column(name = "telefono", nullable = false, length = 20)
    private String telefono;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    // Texto informativo, solo se muestra (ej: "Lunes a Viernes: 09:00 - 18:30 hrs")
    @Column(name = "horario", nullable = false, length = 255)
    private String horario;

    @Column(name = "mapa_url", length = 1000)
    private String mapaUrl;
}
