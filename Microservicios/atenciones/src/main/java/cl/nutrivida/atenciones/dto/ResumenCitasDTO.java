package cl.nutrivida.atenciones.dto;

import lombok.Data;

@Data
public class ResumenCitasDTO {
    private Long citasHoy;
    private Long citasPendientes;
    private Long ingresosMes;
}
