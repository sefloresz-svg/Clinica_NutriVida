package cl.nutrivida.usuarios.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// Cuenta de cualquier persona que inicia sesion: Admin, Nutricionista o Paciente
@Data
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    // Sin puntos y con guion (12345678-5). El Admin y los nutricionistas pueden no tener RUT
    @Column(name = "rut", unique = true, length = 12)
    private String rut;

    @Column(name = "correo", nullable = false, unique = true, length = 100)
    private String correo;

    // Se guarda encriptada con BCrypt, nunca en texto plano
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;

    // Admin, Nutricionista o Paciente
    @Column(name = "rol", nullable = false, length = 20)
    private String rol = "Paciente";

    // Soft delete: en vez de borrar, se desactiva
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    // Se llena solo antes de guardar por primera vez
    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
