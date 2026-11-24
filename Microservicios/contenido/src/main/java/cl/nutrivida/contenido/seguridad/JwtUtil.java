package cl.nutrivida.contenido.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

// Valida el token JWT que crea el microservicio usuarios (misma clave secreta).
// El front manda el token en el header:  Authorization: Bearer <token>
// Si el token no viene, esta mal firmado o vencio -> 401. Si el rol no alcanza -> 403.
@Component
public class JwtUtil {

    private final SecretKey clave;

    public JwtUtil(@Value("${jwt.secreto}") String secreto) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    // Lee el header Authorization, revisa la firma y que no este vencido, y devuelve los datos del token
    public Claims leerToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión.");
        }
        try {
            return Jwts.parser().verifyWith(clave).build()
                    .parseSignedClaims(header.substring(7))
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Tu sesión expiró o no es válida. Inicia sesión nuevamente.");
        }
    }

    // Id del usuario que hace la peticion (sale del token, no de un parametro que se pueda inventar)
    public Long obtenerIdUsuario(HttpServletRequest request) {
        return Long.valueOf(leerToken(request).getSubject());
    }

    // Para endpoints solo de Admin: si el rol del token no es Admin se corta aqui con 403.
    // Igual el service vuelve a revisar en la BD que siga activo y siendo Admin.
    public Long obtenerIdAdmin(HttpServletRequest request) {
        Claims datos = leerToken(request);
        if (!"Admin".equals(datos.get("rol", String.class))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Acceso denegado. Esta acción es exclusiva para Administradores.");
        }
        return Long.valueOf(datos.getSubject());
    }
}
