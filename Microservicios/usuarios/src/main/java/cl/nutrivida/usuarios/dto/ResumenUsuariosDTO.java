package cl.nutrivida.usuarios.dto;

import lombok.Data;

// Respuesta para los KPIs del panel de administracion
@Data
public class ResumenUsuariosDTO {
    private Long pacientesActivos;
    private Long nutricionistasActivos;
}
