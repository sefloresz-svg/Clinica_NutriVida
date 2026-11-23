package cl.nutrivida.atenciones.client;

import cl.nutrivida.atenciones.dto.NutricionistaDTO;
import cl.nutrivida.atenciones.dto.UsuarioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class UsuarioClient {

    private final WebClient webClient;

    public UsuarioClient(WebClient.Builder builder) {
        this.webClient = builder.clone().baseUrl("http://usuarios").build();
    }

    public UsuarioDTO buscarUsuario(Long id) {
        try {
            return webClient.get()
                    .uri("/api/usuarios/{id}", id)
                    .retrieve()
                    .bodyToMono(UsuarioDTO.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            return null;
        } catch (Exception e) {
            throw errorConexion();
        }
    }

    public NutricionistaDTO buscarNutricionista(Long id) {
        try {
            return webClient.get()
                    .uri("/api/nutricionistas/{id}", id)
                    .retrieve()
                    .bodyToMono(NutricionistaDTO.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            return null;
        } catch (Exception e) {
            throw errorConexion();
        }
    }

    public NutricionistaDTO buscarNutricionistaPorUsuario(Long idUsuario) {
        try {
            return webClient.get()
                    .uri("/api/nutricionistas/usuario/{idUsuario}", idUsuario)
                    .retrieve()
                    .bodyToMono(NutricionistaDTO.class)
                    .block();
        } catch (WebClientResponseException.NotFound e) {
            return null;
        } catch (Exception e) {
            throw errorConexion();
        }
    }

    private ResponseStatusException errorConexion() {
        return new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                "No se pudo conectar con el microservicio usuarios");
    }
}
