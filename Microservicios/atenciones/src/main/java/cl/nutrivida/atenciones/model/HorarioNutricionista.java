package cl.nutrivida.atenciones.model;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "horario_nutricionista")
public class HorarioNutricionista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_nutricionista")
    private Long id;

    @Column(name = "id_nutricionista", nullable = false)
    private Long idNutricionista;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;
}
