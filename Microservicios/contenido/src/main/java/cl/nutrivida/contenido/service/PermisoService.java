package cl.nutrivida.contenido.service;

import cl.nutrivida.contenido.client.UsuarioClient;
import cl.nutrivida.contenido.dto.UsuarioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

// Revisa (preguntandole a usuarios) que quien hace el cambio sea un Admin activo.
// Lo usan los 3 services de este microservicio, por eso esta en su propia clase.
@Service
public class PermisoService {

    private final UsuarioClient usuarioClient;

    public PermisoService(UsuarioClient usuarioClient) {
        this.usuarioClient = usuarioClient;
    }

    public void validarAdmin(Long idAdmin) {
        if (idAdmin == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Falta el id del administrador.");
        }
        UsuarioDTO usuario = usuarioClient.buscarUsuario(idAdmin);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe.");
        }
        if (!usuario.getActivo() || !"Admin".equals(usuario.getRol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acceso denegado. Esta acción es exclusiva para Administradores.");
        }
    }
}
